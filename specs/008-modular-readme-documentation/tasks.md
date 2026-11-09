# Tasks: Documentação Modular e Matriz de READMEs do Monorepo

**Input**: Design documents from `/specs/008-modular-readme-documentation/`
**Prerequisites**: plan.md, spec.md, research.md, contracts/documentation-matrix.md
**Organization**: Tasks are grouped by phase and user story for deterministic sequential execution.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Tarefas paralelizáveis (arquivos distintos, sem dependência mútua)
- **[Story]**: Mapeamento para história de usuário (`[US1]`, `[US2]`, `[US3]`)

---

## Phase 1: Setup & Auditoria de Módulos

**Purpose**: Mapeamento dos arquivos e validação das referências estruturais antes da escrita

- [x] T001 Auditar a estrutura de diretórios e validar a matriz de arquivos em `specs/008-modular-readme-documentation/contracts/documentation-matrix.md`
- [x] T002 Validar a contagem de testes e scripts disponíveis no `package.json` raiz e nos `package.json` dos workspaces

---

## Phase 2: Foundational - README.md Raiz do Monorepo (Priority: P1)

**Purpose**: Atualizar o ponto de entrada principal do projeto com o ecossistema completo de 4 workspaces e guia de navegação

- [x] T003 [US1] Atualizar o `README.md` raiz para incluir a arquitetura unificada de 4 workspaces (`apps/server`, `apps/web`, `apps/mobile`, `packages/shared`)
- [x] T004 [US1] Atualizar diagramas de fluxo (Freelancer, Contratante e Backend/Database) no `README.md` raiz
- [x] T005 [US1] Adicionar seção de Mapa Arquitetural de Navegação (Architecture Directory Map) no `README.md` raiz com links para os READMEs de cada módulo

---

## Phase 3: Workspaces de Nível Superior (Priority: P2)

**Purpose**: Atualizar e padronizar os READMEs dos 4 workspaces principais

- [x] T006 [P] [US2] Criar e estruturar `apps/server/README.md` (Fastify, tRPC v11, Drizzle ORM, SQL Server, routers, seeds e scripts)
- [x] T007 [P] [US2] Atualizar e expandir `apps/web/README.md` (React 19, Vite, PWA, Mapas, RBAC, contextos e integração)
- [x] T008 [P] [US2] Atualizar e expandir `apps/mobile/README.md` (Expo SDK 51, React Native, Metro Bundler monorepo, abas e navegação)
- [x] T009 [P] [US2] Atualizar e expandir `packages/shared/README.md` (OpenAPI 3.0, Orval, validadores fiscais, tipos canônicos e mocks)

---

## Phase 4: Submódulos do Backend (`apps/server`) (Priority: P3)

**Purpose**: Criar READMEs detalhando cada arquivo nos submódulos do servidor backend

- [x] T010 [P] [US3] Criar `apps/server/src/db/README.md` detalhando `client.ts`, `schema.ts` e `seed.ts`
- [x] T011 [P] [US3] Criar `apps/server/src/routers/README.md` detalhando `index.ts`, `auth.ts`, `gigs.ts`, `chat.ts`, `contractor.ts` e `freelancer.ts`
- [x] T012 [P] [US3] Criar `apps/server/src/trpc/README.md` detalhando `context.ts` e `init.ts`

---

## Phase 5: Submódulos do Pacote Compartilhado (`packages/shared`) (Priority: P3)

**Purpose**: Criar READMEs detalhando cada arquivo nos submódulos de `packages/shared`

- [x] T013 [P] [US3] Criar `packages/shared/src/api/README.md` detalhando `index.ts`, pasta `endpoints/` e pasta `model/`
- [x] T014 [P] [US3] Criar `packages/shared/src/data/README.md` detalhando `mockGigs.ts` e `mockContractorData.ts`
- [x] T015 [P] [US3] Criar `packages/shared/src/types/README.md` detalhando `index.ts`, `contractor.ts` e `freelancerFlow.ts`
- [x] T016 [P] [US3] Criar `packages/shared/src/utils/README.md` detalhando `formatters.ts`, `freelancerFlowState.ts` e `gigs.ts`

---

## Phase 6: Submódulos do Frontend Web (`apps/web`) (Priority: P3)

**Purpose**: Criar READMEs detalhando cada arquivo nos submódulos de `apps/web`

- [x] T017 [P] [US3] Criar `apps/web/src/components/README.md` detalhando componentes de UI, Map, Flow, Chat e Navigation
- [x] T018 [P] [US3] Criar `apps/web/src/context/README.md` detalhando `AuthContext.tsx`, `ContractorContext.tsx` e `FreelancerFlowContext.tsx`
- [x] T019 [P] [US3] Criar `apps/web/src/hooks/README.md` detalhando `useFreelancerGigFlow.ts` e `useGigsQuery.ts`
- [x] T020 [P] [US3] Criar `apps/web/src/routes/README.md` detalhando `ProtectedRoute.tsx` e `routes.tsx`
- [x] T021 [P] [US3] Criar `apps/web/src/screens/README.md` detalhando telas de Freelancer e Contratante

---

## Phase 7: Submódulos do Aplicativo Móvel (`apps/mobile`) (Priority: P3)

**Purpose**: Criar READMEs detalhando cada arquivo nos submódulos de `apps/mobile`

- [x] T022 [P] [US3] Criar `apps/mobile/src/api/README.md` detalhando `authenticatedFetch.ts` e `useAuthenticatedFetch.ts`
- [x] T023 [P] [US3] Criar `apps/mobile/src/context/README.md` detalhando `AuthContext.tsx`, `FreelancerFlowContext.tsx`, `freelancerFlowState.ts` e `session.ts`
- [x] T024 [P] [US3] Criar `apps/mobile/navigation/README.md` detalhando `RootNavigator.tsx`, `authNavigation.ts` e `types.ts`
- [x] T025 [P] [US3] Criar `apps/mobile/src/screens/README.md` detalhando todas as telas nativas de Freelancer e Contratante

---

## Phase 8: Verificação Final e Qualidade

**Purpose**: Validação de links cruzados e integridade com as regras do projeto

- [x] T026 Validar que todos os links relativos entre os READMEs estão funcionando e corretos
- [x] T027 Executar `compile_applet` e `lint_applet` para confirmar que a árvore do monorepo permanece 100% íntegra
