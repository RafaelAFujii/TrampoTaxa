# Implementation Plan: Documentação Modular e Matriz de READMEs do Monorepo

**Branch**: `008-modular-readme-documentation` | **Date**: 2026-11-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-modular-readme-documentation/spec.md`

## Summary

O objetivo desta especificação é criar uma malha de documentação viva, modular e hiperligada para todo o monorepo TrampoTaxa. Isso envolve:
1. Atualizar o `README.md` raiz para refletir o ecossistema completo de 4 workspaces (`apps/web`, `apps/mobile`, `apps/server`, `packages/shared`).
2. Atualizar ou criar o `README.md` de cada um dos workspaces.
3. Criar READMEs dedicados para cada submódulo arquitetural chave em cada workspace, contendo a descrição exata de cada arquivo, seu propósito técnico, exportações e integração.

## Technical Context

**Language/Version**: Markdown (GFM), Mermaid Diagrams, ASCII architecture graphs
**Primary Dependencies**: Bun Workspaces, Vite, Expo SDK 51, Fastify / tRPC v11, Drizzle ORM, Orval OpenAPI
**Storage**: Documentação estática versionada no repositório Git
**Testing**: Verificação de links internos, conformidade com lint/build, integridade da documentação
**Target Platform**: Repositório GitHub, IDEs (VSCode/Cursor), Web, Mobile
**Project Type**: Monorepo Documentation Framework
**Performance Goals**: Tempo de busca de documentação de qualquer arquivo < 30 segundos
**Constraints**: Obedecer estritamente ao Scope Guard do Spec-Kit (nenhuma alteração fora de `specs/` antes da autorização `implement`)
**Scale/Scope**: 1 README raiz + 4 READMEs de workspaces + 15 READMEs de submódulos cobrindo todos os arquivos do monorepo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Princípio I (TypeScript)**: Documentação deve referenciar tipos e padrões estritos de TypeScript utilizados no monorepo. [PASS]
- **Princípio II (Platform Architecture)**: Documentação deve preservar e explicitar as fronteiras entre Web (Vite), Mobile (React Native), Server (Fastify/tRPC) e Shared. [PASS]
- **Princípio III (Auth & RBAC)**: Documentação deve detalhar os fluxos de autenticação JWT e papéis (`freelancer` vs `contractor`). [PASS]
- **Princípio IV (Test-First & TDD)**: Documentação deve destacar as suítes de testes automatizados e critérios de qualidade. [PASS]
- **Princípio V (Safe Delivery)**: Documentação deve referenciar os pipelines de CI/CD e as políticas de release. [PASS]

## Project Structure

### Documentation (this feature)

```text
specs/008-modular-readme-documentation/
├── spec.md              # Especificação de requisitos e cenários
├── checklists/
│   └── requirements.md  # Checklist de qualidade da especificação
├── plan.md              # Este plano de implementação
├── research.md          # Mapeamento completo dos módulos e arquivos
├── quickstart.md        # Guia rápido de navegação pela nova malha de docs
├── contracts/
│   └── documentation-matrix.md # Matriz de correspondência diretório -> README -> arquivos
└── tasks.md             # Sequenciamento ordenado de tarefas de implementação
```

### Target Monorepo Documentation Hierarchy

```text
/ (Raiz)
├── README.md                                  # Visão Geral do Monorepo, Arquitetura 4 Workspaces, Guia Unificado
│
├── apps/
│   ├── server/
│   │   ├── README.md                          # Arquitetura do Backend tRPC, Drizzle ORM, Fastify, SQL Server
│   │   └── src/
│   │       ├── db/README.md                   # Explicação: client.ts, schema.ts, seed.ts
│   │       ├── routers/README.md              # Explicação: auth.ts, gigs.ts, chat.ts, contractor.ts, freelancer.ts, index.ts
│   │       └── trpc/README.md                 # Explicação: context.ts, init.ts
│   │
│   ├── web/
│   │   ├── README.md                          # Arquitetura Web SPA/PWA React 19, Vite, Tailwind, Workbox
│   │   └── src/
│   │       ├── components/README.md           # Explicação de ErrorBoundary, MobileFrame, chat/, flow/, map/, navigation/, ui/
│   │       ├── context/README.md              # Explicação: AuthContext.tsx, ContractorContext.tsx, FreelancerFlowContext.tsx
│   │       ├── hooks/README.md                # Explicação: useFreelancerGigFlow.ts, useGigsQuery.ts
│   │       ├── routes/README.md               # Explicação: ProtectedRoute.tsx, routes.tsx
│   │       └── screens/README.md              # Explicação de todas as telas (Freelancer & Contractor)
│   │
│   └── mobile/
│       ├── README.md                          # Arquitetura Mobile React Native, Expo SDK 51, Metro, BottomTabs
│       ├── navigation/README.md               # Explicação: RootNavigator.tsx, authNavigation.ts, types.ts
│       └── src/
│           ├── api/README.md                  # Explicação: authenticatedFetch.ts, useAuthenticatedFetch.ts
│           ├── context/README.md              # Explicação: AuthContext.tsx, FreelancerFlowContext.tsx, freelancerFlowState.ts, session.ts
│           ├── hooks/README.md                # Explicação: useFreelancerGigFlow.ts
│           └── screens/README.md              # Explicação de todas as telas nativas
│
└── packages/
    └── shared/
        ├── README.md                          # Contratos Canônicos, OpenAPI 3.0, Orval Pipeline
        └── src/
            ├── api/README.md                  # Explicação de endpoints/, model/ e clientes gerados
            ├── data/README.md                 # Explicação: mockContractorData.ts, mockGigs.ts
            ├── types/README.md                # Explicação: contractor.ts, freelancerFlow.ts, index.ts
            └── utils/README.md                # Explicação: formatters.ts, freelancerFlowState.ts, gigs.ts
```

## Complexity Tracking

Nenhuma violação constitucional. A documentação segue estritamente o princípio de clareza, rastreabilidade e governança.
