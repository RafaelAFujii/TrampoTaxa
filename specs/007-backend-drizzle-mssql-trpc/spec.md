# Feature Specification: Backend TrampoTaxa (Drizzle ORM + SQL Server + tRPC Bun)

**Feature Branch**: `007-backend-drizzle-mssql-trpc`  
**Created**: 2026-11-08  
**Status**: Specified / Planned (Phase: Specify/Plan)  
**Input**: Migração do estado de dados mocados (frontend/localStorage) para back-end real com Bun, tRPC, Drizzle ORM e Microsoft SQL Server.

---

## 1. Visão Geral & Objetivos de Engenharia

O **TrampoTaxa** requer uma API transacional, escalável e tipada de ponta a ponta (End-to-End Type-Safety) para gerenciar o ecossistema de contratação e turnos operacionais de hospitalidade em Curitiba.

Esta especificação estabelece os 3 pilares técnicos de transição:
1. **Modelagem Relacional (Drizzle ORM no SQL Server)**: Mapeamento dos tipos do frontend (`GigOffer`, `ContractorGig`, `FreelancerApplicant`, `User`, `ChatMessage`) em tabelas relacionais com chaves estrangeiras, restrições e índices performáticos.
2. **Carga e Inicialização de Dados (Seed Script)**: Script idempotente populando o SQL Server com os dados originais dos mocks em `packages/shared`, preservando cenários de testes, estabelecimentos de Curitiba e candidatos pré-configurados.
3. **Roteamento Type-Safe (tRPC sobre Bun.serve)**: Exposição de *queries* e *mutations* autenticadas via Bearer JWT, isolando regras de negócio críticas (Overbooking de 3 vagas, validação de QR Mestre `QR_MESTRE_123`, Janela de auto-checkout de 2h e relatórios de ganhos).

---

## 2. Requisitos Funcionais & Contratos de Roteamento

### RF-01: Autenticação e Contexto de Segurança
- Suporte a Bearer Token no header `Authorization` em todas as rotas protegidas (`protectedProcedure`).
- RBAC estrito (Fail-Closed): Procedures com verificação de papéis (`Contratante` vs `Freelancer`).
- Geração e validação de tokens JWT compatíveis com a arquitetura existente.

### RF-02: Gerenciamento de Taxas e Vagas (`gigsRouter`)
- `list`: Filtro por status (`Aberta`, `Preenchida`), profissão (`Bartender`, `Garçom`, etc.) e geolocalização/bairro em Curitiba.
- `byId`: Detalhes completos da vaga, requisitos de apresentação, dress code e estabelecimento.
- `create`: Criação de novas taxas por contratantes autenticados.

### RF-03: Jornada Freelancer & Overbooking Controlado (`freelancerRouter`)
- `apply`: Candidatura com validação de concorrência — máximo de 3 vagas no mesmo horário (`MAX_CONCURRENT_APPLICATIONS = 3`).
- `checkIn`: Validação de presença com código mestre presencial (`QR_MESTRE_123`).
- `checkOut`: Abertura da janela de contestação de 2 horas e aprovação tácita (`pix_agendado`).
- `submitReview`: Registro obrigatório de avaliação 5 estrelas do contratante.
- `earnings`: Extrato financeiro consolidado por períodos (diário, semanal, mensal).

### RF-04: Gestão do Contratante (`contractorRouter`)
- `dashboardKPIs`: Total investido, vagas abertas, freelancers contratados e taxa de pontualidade.
- `approveApplicant`: Aceite de freelancer, promovendo a vaga para `Preenchida` e cancelando automaticamente candidaturas concorrentes em overbooking.
- `releasePix`: Aprovação antecipada manual ou tácita do repasse financeiro.

### RF-05: Chat da Operação (`chatRouter`)
- `getMessages`: Histórico de mensagens do turno entre gerente e freelancer.
- `sendMessage`: Envio de mensagens com timestamp e rastreio de leitura.

---

## 3. Arquitetura de Dados & Schemas (SQL Server / Drizzle)

Dialeto SQL Server no Drizzle ORM (`drizzle-orm/sqlserver` / `drizzle-orm/mssql`):
- `users`: Usuários do sistema (Contratantes com CNPJ e Freelancers com CPF/Chave PIX).
- `venues`: Bares e restaurantes parceiros com coordenadas geográficas.
- `gigs`: Vagas e turnos operacionais com horários, dress code e segredo de QR Code.
- `gig_applicants`: Candidaturas com controle de overbooking e estados de aprovação.
- `chat_messages`: Mensagens de suporte e alinhamento operacional.
- `reviews`: Avaliações mútuas de desempenho e feedback de estabelecimentos.
