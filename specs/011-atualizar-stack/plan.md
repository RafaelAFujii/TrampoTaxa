# Implementation Plan: Atualização da Stack Tecnológica

**Branch**: `011-atualizar-stack` | **Date**: 2026-11-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/011-atualizar-stack/spec.md`

## Summary

Inventory the runtimes, frameworks, direct dependencies, build/test tools, and delivery tooling used by every maintained workspace. Upgrade them to the latest vendor-supported stable releases, coordinate coupled versions, regenerate the Bun lockfile, and update the version inventory and directly affected documentation. Preserve product behavior, data compatibility, security rules, and the project's architectural principles. Upgrade the mobile stack incrementally by Expo SDK release and move the .NET backend off the now out-of-support .NET 8 line.

## Technical Context

**Language/Version**: TypeScript workspaces currently use React 19 on web and React 18.2 / React Native 0.74 on mobile; the .NET API and tests target .NET 8. The CI workflows use Node.js 24 and a floating `bun-version: latest`. The latest stable supported targets must be rechecked from official sources when implementation begins.

**Primary Dependencies**: Bun workspaces; web React 19, Vite 8, Tailwind CSS 4, TypeScript 5.8; mobile Expo SDK 51, React Native 0.74, React Navigation 6; `apps/server` tRPC 10 and Zod 3 while the root manifest declares tRPC 11 and Zod 4; .NET 8 / ASP.NET Core, EF Core/Npgsql 8, Swagger, and xUnit. These are repository baselines, not target versions.

**Storage**: The repository documents PostgreSQL 15 for the .NET service and uses the `mssql` client for the Bun service. Database engines and externally managed data services are not upgraded by this feature; compatible client/provider packages remain in scope. Integration validation must use a disposable database.

**Testing**: Existing Bun/Vitest suites for root, web, mobile, and shared workspaces; web lint/type checks and production build; mobile type check and Expo configuration; shared API generation; .NET solution build and integration tests. CI currently covers the JavaScript workspaces but does not build/test the .NET solution. Add an isolated .NET CI validation path as part of this upgrade so the updated backend and test packages are continuously verified.

**Target Platform**: Browser/PWA, iOS/Android through Expo, Bun/Node.js services, and the .NET API on supported .NET hosts. The production host for the .NET service is not established by the repository; deployment infrastructure changes are out of scope, and host compatibility must be verified before release.

**Project Type**: Existing multi-workspace monorepo containing web and mobile applications, two backend workspaces, shared TypeScript code, documentation, and GitHub Actions workflows.

**Performance Goals**: No new performance SLO is introduced. Existing critical flows must not regress; the feature's completion criterion is support, compatibility, security, and successful validation.

**Constraints**: Use only stable vendor-supported releases, not previews. Select exact versions using official release/support and compatibility sources at implementation time. The Expo SDK's published compatibility matrix takes precedence over independently selecting React Native or Expo module versions. Preserve the Metro monorepo configuration, tRPC v11 as the server/client contract, TanStack Query v5, Zustand state ownership, strict TypeScript, RBAC, and fail-closed authorization. Keep version declarations in the Constitution synchronized with confirmed targets without changing its architectural principles. Never run backend integration tests against production or shared databases. Do not change product features, external database engines, schemas, or production hosting as part of this work.

**Scale/Scope**: Root plus `apps/web`, `apps/mobile`, `apps/server`, `apps/server-dotnet`, and `packages/shared`. Include directly declared runtime/development dependencies, toolchains, CI action versions, the Bun lockfile, supported-version documentation, and compatibility edits/tests directly required by upgrades. Assess transitive versions through the lockfile and vulnerability checks. External managed service versions are excluded.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | Gate | Application to this plan |
|---|---|---|
| I. tRPC v11 as the sole client/server contract | Pass with boundary | Keep the mandated tRPC v11 contract and do not add or expand alternative clients. Align the `apps/server` declaration with the repository's existing v11 constraint. Existing API patterns outside this version-upgrade scope are not redesigned here. |
| II. Shared business logic and dumb screens | Pass | Compatibility fixes must preserve business logic in `packages/shared`; no unrelated feature or screen logic changes. |
| III. React Query v5 and Zustand state ownership | Pass | Update within the architecture's required state-management model; no mutable high-frequency state is moved to React Context. |
| IV. Metro workspace resolution | Pass | Preserve `watchFolders`, workspace resolution, and shared-package mappings; validate them after the Expo SDK migration. |
| V. Repository hygiene and anti-bloat | Pass | Add one concise, maintained technology inventory because the spec requires it. Do not add a general-purpose updater or duplicate inventory artifacts. |
| VI. Strict TypeScript and test-first changes | Pass | Keep strict typing; compatibility changes receive focused tests and all affected workspace checks. |
| Fail-closed authentication and RBAC | Pass | Preserve server-side authorization and security behavior; do not weaken checks to accommodate dependency migrations. |
| Official stack version declarations | Pass with documentation update | Refresh only the dated/versioned stack entries after target versions are verified; preserve all architectural principles and record the amendment. |

**Gate result**: PASS. The upgrade changes version declarations and compatibility code only where required. It does not authorize architecture, API, data, or product behavior redesign.

## Upgrade Strategy

1. **Baseline and target matrix**: Enumerate each maintained workspace, direct dependency, runtime/toolchain, workflow action, current resolved version, support phase, latest stable target, source, and compatibility constraints. Resolve duplicate declarations and manifest/lockfile drift before changing versions.
2. **Shared JavaScript toolchain**: Select and pin one supported Node.js/Bun toolchain for local guidance and CI. Upgrade shared/root packages and the web/server dependency groups, keeping architectural major-version constraints and workspace peer dependencies consistent. Regenerate and review `bun.lock`.
3. **Mobile native stack**: Advance Expo one SDK at a time, following each SDK's release notes. At each step align React, React Native, Expo modules, and native dependencies using the SDK compatibility matrix; validate the app and preserve Metro workspace resolution before moving to the next SDK.
4. **.NET backend**: Move the API and tests from .NET 8 to the latest stable supported target confirmed at implementation time. Upgrade the ASP.NET Core, EF Core/Npgsql, authentication, OpenAPI, and test packages as a compatible set; use official breaking-change guidance.
5. **CI, inventory, and documentation**: Pin CI toolchain versions, update action versions and validation coverage, publish the single technology inventory, and refresh version statements in the root/workspace READMEs and Constitution. Add .NET build/integration validation backed by a disposable PostgreSQL service.
6. **End-to-end verification**: Run all workspace checks, mobile configuration/native build checks available in the established pipeline, .NET build/tests against isolation, lockfile consistency, and dependency vulnerability checks. Record each result and any approved exception in the inventory.

These workstreams share manifests, a lockfile, and CI gates; execute them in the dependency order above rather than concurrently editing shared files.

## Project Structure

### Documentation (this feature)

```text
specs/011-atualizar-stack/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── technology-upgrade-inventory.md
└── tasks.md
```

### Source Code (repository root)

```text
package.json
bun.lock
bunfig.toml
global.json
.github/workflows/
├── quality.yml
├── mobile-build.yml
└── deploy.yml
apps/
├── web/
│   ├── package.json
│   └── README.md
├── mobile/
│   ├── package.json
│   ├── app.json
│   ├── metro.config.js
│   └── README.md
├── server/
│   └── package.json
└── server-dotnet/
    ├── src/TrampoTaxa.Api/TrampoTaxa.Api.csproj
    ├── tests/TrampoTaxa.Api.Tests/TrampoTaxa.Api.Tests.csproj
    └── README.md
packages/shared/
├── package.json
└── README.md
docs/
└── technology-upgrade-inventory.md
README.md
.specify/memory/constitution.md
```

**Structure Decision**: Keep the existing monorepo and workspace ownership. Update existing manifests, workflow files, and version-focused documentation in place. Add only the required upgrade inventory under `docs/`; do not add product endpoints, database migrations, or a new update service.

## Post-Design Constitution Gate

**Result: PASS.** Phase 1 adds a maintenance inventory and validation guide, then updates existing manifests, CI checks, and version documentation. It does not change application APIs, database schemas, externally managed database engines, or product behavior. The .NET integration-test path uses a disposable PostgreSQL service. The tRPC v11, TanStack Query v5, shared-business-logic, Zustand, Metro, strict-typing, and fail-closed authorization principles remain intact. Any target that conflicts with an architectural mandate or a verified hosting constraint remains blocked pending an approved exception or separate Constitution amendment.

## Complexity Tracking

No Constitution violations or new runtime components are introduced. A single inventory and an isolated .NET validation path are necessary to satisfy the specification's traceability and verification requirements.
