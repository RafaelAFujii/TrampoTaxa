# Implementation Plan: Refatoração Crítica da Arquitetura

**Branch**: `main` | **Date**: 2026-10-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from
`/specs/002-refatoracao-critica-arquitetura/spec.md`

## Summary

Make the shared package the source of truth for OpenAPI generation, enforce ASCII
kebab-case on endpoint grouping tags before Orval runs, and remove mock datasets from
the shared package's default exports and production Web/Mobile bundles. Move the
existing Mobile navigator into `apps/mobile/navigation/` and establish a protected
JWT session context backed by Expo SecureStore with a centralized private-request
authorization boundary.

## Technical Context

**Language/Version**: TypeScript 5.8; Node-compatible TypeScript/JavaScript module
configuration; Bun workspace scripts.

**Primary Dependencies**: Expo SDK 51, React Native 0.74, React Navigation 6 in the
Mobile package manifest, TanStack React Query 5, Orval 8.42, Vitest 5, and Expo
SecureStore (to be added through Expo's SDK-compatible installer).

**Storage**: No server or domain storage changes. Persist the Mobile JWT only in
platform-protected credential storage; keep transient session state in memory.

**Testing**: Vitest for shared and focused behavior tests; Web production build;
Mobile TypeScript check and Expo production export; OpenAPI tag validation and
generated-output inspection.

**Target Platform**: Monorepo Web application (React/Vite), Expo/React Native Mobile
(Android and iOS), and platform-independent shared TypeScript package.

**Project Type**: Bun workspaces monorepo containing Web, Mobile, and shared packages.

**Performance Goals**: No new latency target. Production Web and Mobile bundles contain
zero mock fixture data; generation and type-checking remain deterministic.

**Constraints**:

- Preserve OpenAPI HTTP paths, schemas, and `operationId` values while normalizing
  endpoint grouping tags only.
- Keep platform-specific credential storage and navigation within Mobile; the shared
  package remains platform-independent.
- Every persisted JWT uses platform-protected storage; never log the credential.
- A token is sent only for private API operations; unauthorized responses and sign-out
  clear both in-memory and persisted state.
- Mocks remain available for tests and explicit development fallbacks, but are absent
  from both production bundles.
- Follow the repository constitution: TypeScript application logic, TDD, JWT through
  an `AuthContext`, server-side authorization remains authoritative, ESLint/Sonar
  quality gates and successful CI before release.

**Scale/Scope**: One OpenAPI contract, one shared generated client, two consuming
applications, two existing fixture modules, and the existing Mobile tab destinations.
No server endpoint, business workflow, or data-volume changes.

## Constitution Check

*GATE: Must pass before research; re-check after design.*

### Pre-research

- **TypeScript for application logic**: PASS. New validators, session logic, and
  request integration remain typed application code; generator configuration and
  generated artifacts are declarative/generated.
- **Platform architecture**: PASS. Expo SecureStore, session context, and native
  navigation stay in `apps/mobile`; shared API/domain code remains platform-neutral.
- **Authenticated and authorized access**: PASS WITH SCOPE LIMIT. Mobile uses JWT state
  through an `AuthContext`-style provider and gates routes/requests. Server-side
  authorization and RBAC remain authoritative. First-access/business authentication
  behavior is not redesigned.
- **Test-first development**: PASS. Add failing tests for tag validation, import
  boundaries, production mock exclusion, session transitions, and request headers
  before implementing behavior.
- **Measurable quality and safe delivery**: PASS AS A RELEASE GATE. Use the existing
  ESLint/Sonar and CI requirements; do not represent a plan-stage check as a release
  or waive the quality thresholds.

### Post-design

- **TypeScript and platform boundaries**: PASS. Shared generation and the API tag
  validator reside with shared contract ownership; SecureStore and native routing
  remain Mobile-only.
- **JWT and authorization**: PASS. The design clears invalid sessions and applies
  client-side route/request boundaries without substituting for backend authorization.
- **TDD and quality gates**: PASS. The quickstart covers focused tests, production
  builds, and type checks. Existing repository-level CI and Sonar release requirements
  remain in force.
- **Unjustified constitution violations**: None.

## Project Structure

### Documentation (this feature)

```text
specs/002-refatoracao-critica-arquitetura/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── client-architecture.md
└── tasks.md                 # Created by /speckit-tasks
```

### Source Code (repository root)

```text
packages/shared/
├── openapi.yaml
├── orval.config.ts
├── package.json
├── scripts/
│   └── validate-openapi-tags.ts
└── src/
    ├── index.ts
    ├── mocks.ts
    └── api/
        ├── endpoints/       # Regenerated using ASCII tag-derived paths
        └── model/

apps/web/
└── src/
    ├── hooks/               # Development-only fixture fallbacks use /mocks
    └── screens/             # Development-only fixture fallbacks use /mocks

apps/mobile/
├── App.tsx
├── navigation/
│   ├── RootNavigator.tsx
│   └── types.ts
└── src/
    ├── api/                 # Private-request authorization boundary
    └── context/
        └── AuthContext.tsx  # Session restoration and transitions
```

**Structure Decision**: Retain the current Bun monorepo and application boundaries.
Move only API contract ownership and generation to `packages/shared`; keep the
existing generated-client location there. Use a dedicated shared mock subpath and
development-only app imports. Extract the current Mobile tab navigation from `App.tsx`
into a native `navigation/` directory and keep JWT storage/session behavior in Mobile.

## Phase 0: Research

Completed in [research.md](./research.md). Repository evidence confirms current
accented `tags-split` directories, Web-owned generation configuration, mock exports
from the shared root, and direct Web/Mobile imports of those fixtures. The chosen
credential store is Expo SecureStore because it uses platform-protected storage on
Android and iOS; no platform-specific storage is introduced into shared code.

## Phase 1: Design & Contracts

Completed:

- [data-model.md](./data-model.md) defines OpenAPI tag, mock fixture, and Mobile
  authentication session invariants and transitions.
- [contracts/client-architecture.md](./contracts/client-architecture.md) defines
  package imports, code generation ownership, Mobile bearer-request behavior, and
  authenticated route handling.
- [quickstart.md](./quickstart.md) records runnable generation, tests, builds, bundle
  inspection, and session validation steps.

## Complexity Tracking

No constitution violations or additional architectural components require justification.
