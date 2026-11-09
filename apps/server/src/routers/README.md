# 🛣️ tRPC Routers (`apps/server/src/routers`)

Este módulo contém a lógica de negócios e os controladores da API do servidor backend, estruturados com o **tRPC v11** e validação de contratos com **Zod**.

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Domínio / Responsabilidade | Principais Procedures | Middleware / RBAC |
| :--- | :--- | :--- | :--- |
| **`index.ts`** | Agregação do `AppRouter` principal e exportação de tipos | `appRouter`, `AppRouter` | Combina todos os sub-routers |
| **`auth.ts`** | Autenticação, emissão de JWT e perfil da sessão | `login`, `register`, `me` | `publicProcedure` e `protectedProcedure` |
| **`gigs.ts`** | Ciclo de vida das vagas, radar geolocalizado e check-in | `list`, `byId`, `create`, `checkIn`, `checkOut` | `publicProcedure` e `contractorProcedure` |
| **`freelancer.ts`** | Candidaturas, extrato de rendimentos e perfil do autônomo | `apply`, `myGigs`, `earnings`, `updateProfile` | `freelancerProcedure` |
| **`contractor.ts`** | Triagem de candidatos, relatórios de custo B2B e KPIs | `myGigs`, `applicants`, `approveApplicant`, `rejectApplicant`, `reports` | `contractorProcedure` |
| **`chat.ts`** | Mensageria operacional entre contratante e freelancer | `listMessages`, `sendMessage` | `protectedProcedure` |

---

## 🏛️ Detalhamento dos Routers

### 1. `auth.ts` — Identidade e Sessão
* **`login`**: Recebe `email` e `password`, valida as credenciais contra a base relacional e emite um token JWT com claim de papel (`role`).
* **`register`**: Cadastra novo usuário como `freelancer` (validando CPF) ou `contractor` (validando CNPJ), aplicando hash de senha.
* **`me`**: Retorna os dados sanitizados da sessão ativa do usuário autenticado.

### 2. `gigs.ts` — Vagas e Radar Operacional
* **`list`**: Permite filtragem por profissão (*Bartender*, *Garçom*, etc.), bairro de Curitiba e status operacional.
* **`byId`**: Retorna os detalhes da taxa, incluindo dados de vestimenta (dress code), regras do local e endereço.
* **`create`**: Permite aos estabelecimentos criar vagas emergenciais ou programadas.
* **`checkIn` / `checkOut`**: Valida a presença física no estabelecimento através do código secreto do Master QR Code e registra o timestamp exato do turno.

### 3. `freelancer.ts` — Jornada do Profissional
* **`apply`**: Validação com trava de overbooking (evita candidaturas conflitantes no mesmo horário).
* **`myGigs`**: Lista os turnos aceitos, em andamento e histórico do profissional.
* **`earnings`**: Consolida os valores a receber e repasses efetuados via PIX.

### 4. `contractor.ts` — Painel do Estabelecimento
* **`myGigs`**: Retorna todas as vagas gerenciadas pelo estabelecimento agrupadas por status.
* **`applicants`**: Lista candidatos aguardando triagem com pontuação e histórico.
* **`approveApplicant`**: Aprova o candidato, fecha a vaga e cancela automaticamente candidaturas simultâneas conflitantes daquele profissional.
* **`reports`**: Gera métricas de horas contratadas e investimento total em mão de obra freelancer.

### 5. `chat.ts` — Mensageria em Tempo Real
* Histórico de mensagens contextualizado por `gigId`, permitindo alinhamento de portaria, trajes e horários de chegada.
