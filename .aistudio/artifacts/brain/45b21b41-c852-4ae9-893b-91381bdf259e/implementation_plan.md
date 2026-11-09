# Plano de Implementação: Backend TrampoTaxa (Drizzle ORM + SQL Server + tRPC no Bun)

Plano arquitetural para migração do estado de dados mocados no frontend para um servidor back-end real em `apps/server`, utilizando o runtime Bun, Drizzle ORM com dialeto Microsoft SQL Server, script de seed idempotente a partir de `packages/shared` e roteamento type-safe via tRPC com autenticação Bearer JWT.

---

## Revisão do Usuário & Decisões Confirmadas

> [!IMPORTANT]
> As seguintes decisões técnicas fundamentais foram alinhadas e confirmadas na Fase de Clarificação:

- **Acesso ao Banco de Dados**: Instância de Microsoft SQL Server executada localmente via container Docker (`mcr.microsoft.com/mssql/server`) com porta padrão 1433 e credenciais configuradas via variáveis de ambiente.
- **Protocolo & Adaptador HTTP**: Servidor nativo `Bun.serve` integrando o `fetchRequestHandler` oficial do `@trpc/server/adapters/fetch` para máximo desempenho de I/O e latência ultrabaixa.
- **Contexto de Segurança & Autenticação**: Validação de token JWT no header `Authorization: Bearer <token>`, com decodificação no contexto do tRPC e controle de acesso baseado em papéis (RBAC fail-closed para `Contratante` e `Freelancer`).

---

## 1. Visão Geral & Conceito Central

- **O que entrega**: Uma camada de back-end robusta, transacional e totalmente tipada de ponta a ponta que substitui os mocks de `localStorage`, persistindo turnos, vagas, candidaturas, histórico de chats e relatórios financeiros no Microsoft SQL Server.
- **Público-alvo**: Contratantes de estabelecimentos gastronômicos e freelancers de hospitalidade em Curitiba, servindo tanto o cliente Web (`apps/web`) quanto o aplicativo Mobile (`apps/mobile`).
- **Valor Principal**: Eliminação da perda de dados voláteis no frontend, centralização das regras de negócio críticas (Overbooking de 3 vagas, check-in com QR Mestre `QR_MESTRE_123` e auto-checkout de 2h) e garantia de type-safety sem duplicação de contratos.

---

## 2. Experiência de Integração & Fluxos de Dados

- **Fluxo de Inicialização e Carga**:
  1. O container SQL Server é iniciado com o banco `trampotaxa`.
  2. O script de seed (`seed.ts`) executa inserções idempotentes baseadas nos mocks de `packages/shared/src/data`, populando contratantes (ex: Taj Bar, Bistrô do Batel, Boteco São Jorge), freelancers qualificados, vagas ativas e candidatos.
- **Fluxo de Candidatura com Overbooking Controlado**:
  1. Freelancer aciona `trpc.freelancer.apply.mutate({ gigId })`.
  2. O servidor valida no SQL Server se o freelancer já possui 3 candidaturas ativas no mesmo período; se sim, rejeita com erro semântico de limite de overbooking.
- **Fluxo de Confirmação e Auto-Cancelamento**:
  1. Contratante aciona `trpc.contractor.approveApplicant.mutate({ gigId, freelancerId })`.
  2. Transação SQL Server: a vaga passa para preenchida, o candidato para aprovado, e todas as outras candidaturas ativas do freelancer em vagas simultâneas são transicionadas para canceladas.
- **Fluxo de Check-in Presencial e Auto-Checkout**:
  1. Validação de QR Mestre via `trpc.freelancer.checkIn.mutate({ qrCode: 'QR_MESTRE_123' })`.
  2. Finalização de turno com janela de 2h para contestação antes do repasse automático via PIX.

---

## 3. Decisões Arquiteturais & Trade-Offs

- **Drizzle ORM com Dialeto SQL Server**:
  - *Decisão*: Utilizar tabelas Drizzle mapeadas explicitamente para o SQL Server (`sqlTable`, `uniqueidentifier`, `nvarchar`, `decimal`, `datetime2`).
  - *Por que*: O Drizzle oferece queries SQL transparentes, sem sobrecarga de compilação em runtime, compatibilidade nativa com o Bun e inferência de tipos TypeScript automática.
- **tRPC sobre Bun Fetch Adapter**:
  - *Decisão*: Servir o tRPC diretamente com `Bun.serve` sem frameworks pesados intermediários.
  - *Por que*: O adaptador Fetch é o padrão da especificação web moderna, possui desempenho superior no Bun e compartilha os tipos `AppRouter` diretamente no monorepo sem geração manual de SDKs.
- **Isolamento de Contratos no `packages/shared`**:
  - *Decisão*: Expor o tipo `AppRouter` e os schemas Zod de entrada/saída a partir de `@trampotaxa/shared`.
  - *Por que*: Mantém a arquitetura CDD (Contract-Driven Development) intacta, permitindo que Web e Mobile consumam a mesma fonte da verdade.

---

## 4. Arquitetura Técnica & Estratégia de Dados

### Diagrama de Arquitetura e Comunicação

```
┌────────────────────────────────────────────────────────┐
│                   TrampoTaxa Clients                   │
│   ┌───────────────────────┐   ┌────────────────────┐   │
│   │   apps/web (React)    │   │ apps/mobile (Expo) │   │
│   └───────────┬───────────┘   └─────────┬──────────┘   │
└───────────────┼─────────────────────────┼──────────────┘
                │ tRPC Client via HTTP Fetch
                ▼
┌────────────────────────────────────────────────────────┐
│             apps/server (Bun HTTP Runtime)             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Context: Extração e Validação Bearer JWT         │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │ tRPC Routers: auth, gigs, freelancer, contractor │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │ Drizzle ORM (SQL Server Dialect)                 │  │
│  └────────────────────────┬─────────────────────────┘  │
└───────────────────────────┼────────────────────────────┘
                            │ Conexão Pool Tedious / MSSQL
                            ▼
┌────────────────────────────────────────────────────────┐
│          Microsoft SQL Server (Docker Container)       │
│  Tabelas Relacionais:                                  │
│  • users (Contratantes & Freelancers)                  │
│  • venues (Bares, Bistrôs e Restaurantes de Curitiba)  │
│  • gigs (Taxas, Horários, QR Code Mestre, Status)      │
│  • gig_applicants (Candidaturas e Overbooking)         │
│  • chat_messages (Mensagens Operacionais do Turno)     │
│  • reviews (Avaliações 5 Estrelas e Feedback)          │
└────────────────────────────────────────────────────────┘
```

### Mapeamento de Roteadores e Procedimentos tRPC

| Roteador | Procedimento | Tipo | Descrição |
|---|---|---|---|
| `auth` | `login` / `register` / `me` | Mutation / Query | Autenticação, emissão e validação de tokens JWT |
| `gigs` | `list` / `byId` / `create` | Query / Mutation | Listagem de vagas no radar, detalhes e publicação |
| `freelancer` | `apply` | Mutation | Candidatura respeitando limite de 3 vagas simultâneas |
| `freelancer` | `checkIn` | Mutation | Validação presencial do QR Mestre `QR_MESTRE_123` |
| `freelancer` | `checkOut` | Mutation | Encerramento de turno e início da janela de auto-checkout |
| `freelancer` | `submitReview` | Mutation | Avaliação obrigatória do estabelecimento pós-turno |
| `freelancer` | `earnings` | Query | Extrato e dados de receita em verde neon |
| `contractor` | `listGigs` | Query | Gestão de vagas criadas pelo contratante |
| `contractor` | `approveApplicant`| Mutation | Confirmação e cancelamento das demais vagas em overbooking |
| `contractor` | `releasePix` | Mutation | Liberação imediata ou aprovação tácita do repasse |
| `contractor` | `kpis` | Query | Métricas de investimento, pontualidade e contratações |
| `chat` | `getMessages` / `send` | Query / Mutation | Histórico e troca de mensagens da operação |
