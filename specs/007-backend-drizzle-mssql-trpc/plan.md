# Feature Plan: Backend TrampoTaxa (Drizzle ORM + SQL Server + tRPC Bun)

**Feature Branch**: `007-backend-drizzle-mssql-trpc`  
**Created**: 2026-11-08  
**Status**: Planned  

---

## 1. Arquitetura do Sistema e Topologia Monorepo

```
┌────────────────────────────────────────────────────────┐
│                   TrampoTaxa Clients                   │
│   ┌───────────────────────┐   ┌────────────────────┐   │
│   │   apps/web (React)    │   │ apps/mobile (Expo) │   │
│   └───────────┬───────────┘   └─────────┬──────────┘   │
└───────────────┼─────────────────────────┼──────────────┘
                │ tRPC Client             │ tRPC Client
                ▼                         ▼
┌────────────────────────────────────────────────────────┐
│             apps/server (Bun HTTP Runtime)             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Bun.serve + @trpc/server/adapters/fetch          │  │
│  │ Context: Bearer JWT Auth & RBAC Resolver         │  │
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
                            │ Tedious / MSSQL Client
                            ▼
┌────────────────────────────────────────────────────────┐
│          Microsoft SQL Server (Docker Container)       │
│  Tables: users, venues, gigs, gig_applicants, chats    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Estratégia de Implementação e Etapas

### Fase 1: Setup do Servidor e Configuração Drizzle
1. Inicializar `apps/server` no workspace Bun com dependências necessárias (`@trpc/server`, `zod`, `drizzle-orm`, `mssql`, `@types/mssql`).
2. Configurar conexão com SQL Server via variáveis de ambiente (`MSSQL_HOST`, `MSSQL_PORT`, `MSSQL_USER`, `MSSQL_PASSWORD`, `MSSQL_DATABASE`, `DATABASE_URL`).
3. Estruturar `drizzle.config.ts` apontando para os schemas em SQL Server.

### Fase 2: Modelagem Relacional (Schemas Drizzle)
1. Definir `usersTable`: PK UUID, name, email, passwordHash, role, phone, cnpj/cpf, bio, pixKey, createdAt.
2. Definir `venuesTable`: PK UUID, name, neighborhood, address, lat, lng, rating.
3. Definir `gigsTable`: PK UUID, venueId (FK), title, role, category, shiftDate, startTime, endTime, rate, dressCode, rulesAndNotes, qrCodeSecret, status, shiftPhase.
4. Definir `gigApplicantsTable`: PK UUID, gigId (FK), freelancerId (FK), status, isOverbooking, appliedAt, rating, feedback.
5. Definir `chatMessagesTable`: PK UUID, gigId (FK), senderId (FK), text, timestamp, isRead.

### Fase 3: Script de Carga de Dados (Seed Script - `seed.ts`)
1. Importar mocks de `packages/shared/src/data/mockGigs.ts` e `mockContractorData.ts`.
2. Implementar função idempotente para limpar/popular dados preservando integridade referencial.
3. Cadastrar usuários de teste (Gerentes de estabelecimentos de Curitiba e Freelancers de destaque).
4. Cadastrar locais reais (Taj Bar, Batel Bistro, Boteco São Jorge, Bar do Alemão, Quintal do Monge).
5. Cadastrar taxas ativas e candidaturas históricas para simulação completa.

### Fase 4: Servidor e Roteadores tRPC Type-Safe
1. Criar middleware de contexto: decodificação de Bearer JWT e injeção de `ctx.user`.
2. Implementar procedimentos: `publicProcedure`, `protectedProcedure`, `contractorProcedure`, `freelancerProcedure`.
3. Montar roteadores modulares:
   - `authRouter`: login, signup, me.
   - `gigsRouter`: list, byId, create.
   - `freelancerRouter`: apply (com regra de 3 vagas simultâneas), checkInQrCode, checkOut, review, earnings.
   - `contractorRouter`: listGigs, approveApplicant, releasePix, kpis.
   - `chatRouter`: getMessages, sendMessage.
4. Exportar `AppRouter` para integração tipada em `@trampotaxa/shared`.

### Fase 5: Testes Automatizados e Validação
1. Testes unitários do schema Drizzle e mapeamento de tipos.
2. Testes de integração dos roteadores tRPC com mock de banco ou conexão local.
3. Validação do script de seed e verificação de tipagem completa com `bun test` e `typecheck`.
