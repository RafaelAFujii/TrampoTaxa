# Feature Tasks: Backend TrampoTaxa (Drizzle ORM + SQL Server + tRPC Bun)

**Feature Branch**: `007-backend-drizzle-mssql-trpc`  
**Status**: Ready for Implementation (Awaiting Explicit User Authorization)

---

## Sequenciamento Estrito de Tarefas (Spec-Kit)

### [x] TASK-01: Setup do Pacote `apps/server` no Monorepo Bun
- [x] Criar `apps/server/package.json` com `@trpc/server`, `zod`, `drizzle-orm`, `mssql`, `dotenv`.
- [x] Configurar `apps/server/tsconfig.json` herdando configurações modernas do Bun.
- [x] Criar arquivo de exemplo de ambiente `.env.example` com credenciais padrão do SQL Server Docker.

### [x] TASK-02: Schemas Drizzle ORM para Microsoft SQL Server
- [x] Criar `apps/server/src/db/schema.ts` com tabelas:
  - `usersTable`: PK UUID, name, email, passwordHash, role, phone, cnpj, bio, pixKey.
  - `venuesTable`: PK UUID, name, neighborhood, address, lat, lng, rating.
  - `gigsTable`: PK UUID, venueId FK, title, role, category, shiftDate, startTime, endTime, rate, dressCode, rulesAndNotes, qrCodeSecret, status, shiftPhase.
  - `gigApplicantsTable`: PK UUID, gigId FK, freelancerId FK, status, isOverbooking, appliedAt, rating, feedback.
  - `chatMessagesTable`: PK UUID, gigId FK, senderId FK, text, timestamp, isRead.
- [x] Criar conexão `apps/server/src/db/client.ts` com Drizzle e driver MSSQL.

### [x] TASK-03: Script de Seed com Dados Originais (`seed.ts`)
- [x] Criar `apps/server/src/db/seed.ts` importando os dados de `packages/shared/src/data/mockGigs.ts` e `mockContractorData.ts`.
- [x] Implementar limpeza e inserção idempotente respeitando chaves estrangeiras.
- [x] Popular Contratantes de Curitiba, Freelancers, Vagas e Candidatos com flag de overbooking.

### [x] TASK-04: Servidor Bun e Contexto de Autenticação tRPC
- [x] Criar `apps/server/src/trpc/context.ts` extraindo e validando `Authorization: Bearer <jwt>`.
- [x] Criar `apps/server/src/trpc/init.ts` com instâncias de `publicProcedure`, `protectedProcedure`, `contractorProcedure` e `freelancerProcedure`.

### [x] TASK-05: Roteadores tRPC (Queries & Mutations)
- [x] `apps/server/src/routers/auth.ts`: login, register, me.
- [x] `apps/server/src/routers/gigs.ts`: list, byId, create.
- [x] `apps/server/src/routers/freelancer.ts`: apply (com regra de até 3 vagas em overbooking), checkInQrCode, checkOut, submitReview, earnings.
- [x] `apps/server/src/routers/contractor.ts`: listGigs, approveApplicant, releasePix, kpis.
- [x] `apps/server/src/routers/chat.ts`: getMessages, sendMessage.
- [x] Montar `appRouter` em `apps/server/src/routers/index.ts` e exportar `type AppRouter`.

### [x] TASK-06: Exportação de Tipos em `packages/shared`
- [x] Reexportar `AppRouter` e tipos inferidos de input/output em `packages/shared/src/index.ts`.

### [x] TASK-07: Testes Automatizados e Verificação
- [x] Criar testes unitários em `apps/server/src/__tests__/server.test.ts`.
- [x] Executar `bun test` e compilação para garantir que todas as suítes passam com 0 erros.
