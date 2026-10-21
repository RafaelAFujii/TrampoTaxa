# Implementation Plan: Separação de acessos por perfil Web e Mobile

**Branch**: `[004-separar-acessos-perfis]` | **Date**: 2026-10-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-separar-acessos-perfis/spec.md`

## Summary

Separar o acesso de contratantes e freelancers na Web e no Mobile e garantir que a
navegação autenticada sempre corresponda ao perfil único da conta. Na Web, preservar
a autenticação mockada existente e aplicar rotas de acesso específicas por perfil. No
Mobile, estender o fluxo atualmente freelancer-only para incluir acesso e navegação de
contratante, incluindo vagas, criação de vaga, relatórios e chat adaptados à plataforma.
Em ambas as plataformas, logout, troca de conta e restauração de sessão não podem
reabrir telas ou dados do perfil anterior.

## Technical Context

**Language/Version**: TypeScript 5.8; React 19

**Primary Dependencies**: React/Vite/React Router no Web; React Native/Expo/React
Navigation no Mobile; `AuthContext` Web, contexto de sessão Mobile e modelos/endpoints
compartilhados existentes.

**Storage**: Web persiste sessão em `localStorage` pela chave
`trampo_taxa_auth_user`; Mobile persiste o JWT via armazenamento seguro. O perfil
autenticado do Mobile deve ser obtido da resposta de autenticação ou do endpoint
existente de usuário autenticado e associado à sessão restaurada; não inferir o papel
do nome da tela inicial.

**Testing**: Vitest nos dois apps; validar Web com `npm --prefix apps/web test`,
`npm --prefix apps/web run lint` e `npm --prefix apps/web run build`; validar Mobile
com `npm --prefix apps/mobile test` e `npm --prefix apps/mobile run typecheck`.

**Target Platform**: Navegadores compatíveis com Web Vite e plataformas iOS/Android
suportadas pelo app React Native/Expo.

**Project Type**: Monorepo com aplicação Web React/Vite e aplicação Mobile React
Native/Expo.

**Performance Goals**: A mudança de perfil deve ocorrer sem mostrar tela protegida
incompatível durante login, logout ou restauração; não há meta de desempenho adicional
para este fluxo.

**Constraints**:
- Cada conta possui um único perfil: `Freelancer` ou `Contratante`.
- Web e Mobile devem oferecer acesso e navegação para ambos os perfis; cada plataforma
  preserva sua apresentação nativa.
- A Web permanece com autenticação mockada; o Mobile mantém seu fluxo JWT e a
  identidade autenticada deve incluir um perfil confiável para orientar a navegação.
- As telas e os limites de navegação do cliente não substituem autorização no servidor.
- No Mobile, incluir os fluxos de contratante existentes na Web: vagas, criação,
  relatórios e chat; reutilizar os contratos e modelos compartilhados quando aplicável.
- Não redesenhar cadastro além do necessário para vincular a conta a seu único perfil.

**Scale/Scope**: Acesso específico por perfil, navegação protegida, troca de conta e
restauração coerente nas duas plataformas; adicionar no Mobile jornada de contratante
com listagem de vagas, criação, relatórios e chat. Cobrir teste de ambos os papéis em
Web e Mobile.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | Status | Evidence / plan |
|---|---|---|
| TypeScript for application logic | PASS | Role-aware access, session and navigation behavior remains TypeScript on Web and Mobile. |
| Platform architecture | PASS | Web uses React/Vite; Mobile uses React Native; only platform-independent API/domain contracts are shared. |
| JWT/AuthContext and RBAC | PASS WITH SCOPE NOTE | Keep Web session ownership in `AuthContext` and Mobile JWT/session state in its auth context. Require authenticated role data to select UI/navigation. Client navigation is not server authorization; Web remains mock-authenticated. |
| Test-first (Vitest red-green-refactor) | PASS | Add/adjust Web and Mobile tests for role-specific entry, restore, sign-out, wrong-role destinations and contractor navigation before implementation. |
| Quality and safe delivery | PASS | Run Vitest, Web lint/typecheck/build and Mobile typecheck; no deployment is part of this plan. |

No constitutional violation requires an exception. Both client applications must keep
role-specific experience boundaries, but those boundaries do not replace server-side
authorization for protected data or contractor operations.

## Project Structure

### Documentation (this feature)

```text
specs/004-separar-acessos-perfis/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── access-navigation.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/src/
├── context/
│   ├── AuthContext.tsx
│   └── auth_flow.test.ts
├── routes/
│   ├── routes.tsx
│   ├── ProtectedRoute.tsx
│   └── role-navigation.test.ts
├── screens/
│   ├── LoginScreen.tsx
│   └── login-access.test.ts

apps/mobile/
├── navigation/
│   ├── RootNavigator.tsx
│   ├── authNavigation.ts
│   ├── types.ts
│   └── RootNavigator.test.tsx
├── src/
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── session.ts
│   └── screens/
│       ├── MapScreen.tsx
│       ├── ContractorGigsScreen.tsx
│       ├── CreateGigScreen.tsx
│       ├── ContractorReportsScreen.tsx
│       └── ContractorChatScreen.tsx

packages/shared/src/
├── api/
└── types/
```

**Structure Decision**: Implement platform-specific login and navigation in `apps/web`
and `apps/mobile`; keep shared account-role and API contracts in `packages/shared`
only where they are already canonical. Add tests in each app's existing Vitest
locations. The duplicate root `src/` application is not the canonical workspace and
is out of scope unless existing build wiring requires it.

## Complexity Tracking

No constitutional violations or additional architectural complexity are proposed.

## Phase 0: Research

Completed in [research.md](./research.md). Repository inspection confirmed that Mobile
currently has freelancer-only tabs and token-only session state, while shared API
models already include both user roles and contractor operations.

## Phase 1: Design & Contracts

Completed in [data-model.md](./data-model.md),
[contracts/access-navigation.md](./contracts/access-navigation.md), and
[quickstart.md](./quickstart.md). The design covers both clients and uses the existing
shared API model; it does not require a new public API contract.

## Post-Design Constitution Check

| Principle / constraint | Status | Evidence |
|---|---|---|
| TypeScript and platform boundaries | PASS | Web and Mobile behavior stays in their React/Vite and React Native apps; shared data uses existing shared contracts. |
| AuthContext, roles and security boundary | PASS WITH SCOPE NOTE | Role-specific UI follows authenticated account data; no client-only check is claimed to authorize server operations. Web mock-auth remains unchanged. |
| Test-first and verification | PASS | Quickstart includes focused Web/Mobile tests, Web lint/build, and Mobile typecheck. |
| Quality and delivery | PASS | No release/deployment automation or unrelated package changes are required. |
