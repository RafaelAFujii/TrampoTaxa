# Tasks: Atualização da Stack Tecnológica

**Input**: Design documents from `specs/011-atualizar-stack/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`

**Tests**: The specification requires workspace builds, tests, configuration checks, security-advisory checks, and end-to-end validation. These are validation tasks; add focused tests only when a compatibility change introduces behavior that existing tests do not cover.

**Organization**: Tasks are grouped by user story. Shared inventory and validation infrastructure are established first because both stories depend on them.

## Format

`- [ ] Tnnn [P?] [USn?] Description with repository-relative file path`

- **[P]**: Use only when the task can run safely in parallel without editing the same files or depending on incomplete work.
- **[USn]**: Required for user-story tasks; omitted for setup, foundational, and polish tasks.
- Direct task descriptions name the files to edit or validate.

## Phase 1: Setup

**Purpose**: Create the single version inventory and establish the repository's current baseline.

- [X] T001 Create `docs/technology-upgrade-inventory.md` from `specs/011-atualizar-stack/contracts/technology-upgrade-inventory.md`; inventory current declared/resolved versions for the root and all maintained workspaces from `package.json`, `apps/*/package.json`, `packages/shared/package.json`, both `apps/server-dotnet/**/*.csproj` files, `bun.lock`, and `.github/workflows/*.yml`.
- [X] T002 Record official stable targets, support status/date, and compatibility sources for every in-scope direct dependency, runtime, framework, and tool in `docs/technology-upgrade-inventory.md`; use the Expo SDK matrix for mobile and Microsoft support policy for .NET, and leave unverified targets blocked rather than guessing.

---

## Phase 2: Foundational

**Purpose**: Make CI use the selected toolchain reproducibly and provide a safe backend test environment before version migrations are validated.

- [X] T003 Pin the confirmed stable Node.js, Bun, EAS, and GitHub Actions tool versions in `.github/workflows/quality.yml`, `.github/workflows/mobile-build.yml`, and `.github/workflows/deploy.yml`; configure Bun's hoisted linker in `bunfig.toml` for Expo, pin .NET 11 and the MTP test runner in `global.json`, and add .NET restore/build/integration-test validation to `.github/workflows/quality.yml` using a disposable PostgreSQL service and a test-only `ConnectionStrings__DefaultConnection`.

**Checkpoint**: No test may use a production/shared database, and CI must not rely on a floating `latest` toolchain after this phase.

---

## Phase 3: User Story 1 — Atualizar tecnologias em uso (Priority: P1) 🎯 MVP

**Goal**: Upgrade maintained application and development technologies to the latest vendor-supported stable targets while preserving the product's essential behavior.

**Independent Test**: Review `docs/technology-upgrade-inventory.md` for current/target versions and sources, install from the committed lockfile, and pass the required workspace build/test checks without changing product contracts or data schemas.

### Implementation

- [X] T004 [P] [US1] Update root, web, server, and shared direct dependency declarations to the confirmed stable targets while preserving the Constitution's tRPC v11, TanStack Query v5, Zustand, and workspace peer constraints in `package.json`, `apps/web/package.json`, `apps/server/package.json`, and `packages/shared/package.json`.
- [X] T005 [US1] Upgrade `apps/mobile/package.json` from Expo SDK 51 one SDK release at a time to the confirmed latest supported SDK; align React, React Native, Expo modules, and native dependencies using each SDK's compatibility matrix, preserve `apps/mobile/metro.config.js`, and regenerate `bun.lock` after the workspace manifest updates.
- [X] T006 [P] [US1] Upgrade `apps/server-dotnet/src/TrampoTaxa.Api/TrampoTaxa.Api.csproj` and `apps/server-dotnet/tests/TrampoTaxa.Api.Tests/TrampoTaxa.Api.Tests.csproj` from `net8.0` to the confirmed latest stable supported .NET target; align ASP.NET Core, EF Core/Npgsql, authentication, OpenAPI, xUnit v3 and Microsoft.Testing.Platform integration, making only directly required compatibility edits under `apps/server-dotnet/src/` and `apps/server-dotnet/tests/`.
- [X] T007 [US1] Refresh version/prerequisite statements in `README.md`, `apps/web/README.md`, `apps/mobile/README.md`, `apps/server/README.md`, `apps/server-dotnet/README.md`, and `packages/shared/README.md`; update only the versioned stack declarations in `.specify/memory/constitution.md` while preserving architectural principles; complete the current-version, selected-target, and verification fields in `docs/technology-upgrade-inventory.md`.
- [ ] T008 [US1] BLOCKED: workspace tests fail only the pre-existing production-bundle fixture-isolation checks (web 32/33, mobile 21/22); .NET integration tests and native EAS builds could not be run without a disposable PostgreSQL service/EAS build setup. Other listed validations passed.

**Checkpoint**: The latest supported stable versions are installed and verified across the maintained workspaces; no product behavior or persisted data contract has changed.

---

## Phase 4: User Story 2 — Identificar tecnologias obsoletas (Priority: P2)

**Goal**: Find any unsupported, deprecated, or vulnerable technology missed by the upgrade and either remediate it or document an approved exception.

**Independent Test**: Compare every in-scope inventory entry with current official support/advisory sources; confirm there are no unsupported entries without an approved, time-bounded exception and no unresolved high/critical vulnerability introduced by the upgrade.

### Support and exception review

- [X] T009 [US2] Run JavaScript vulnerability checks with `bun audit --audit-level=high` and run the mutually exclusive NuGet outdated, deprecated, and vulnerable checks as separate `dotnet package list` commands; review framework/tool/CI-action support sources and record all results in `docs/technology-upgrade-inventory.md`.
- [X] T010 [US2] Update or replace any remaining unsupported/deprecated in-scope dependency or tool in the applicable root/workspace manifests, `.csproj` files, or `.github/workflows/*.yml`; regenerate `bun.lock` where needed and preserve behavior required by `specs/011-atualizar-stack/spec.md`.
- [X] T011 [US2] For any technology that cannot be updated, obtain explicit maintainer approval and record its specific reason, risk, owner, due date, approver, approval date, and mitigation in `docs/technology-upgrade-inventory.md`; leave unapproved items blocked. (No unsupported/deprecated dependency exception was required; lower transitive advisories are documented separately.)
- [ ] T012 [US2] BLOCKED: final web/mobile workspace checks are not green because the production bundles contain fixture-only data; Bun/NuGet advisory scans show no high/critical JS or NuGet vulnerabilities and no outdated/deprecated direct packages.

**Checkpoint**: All support gaps have been fixed or explicitly approved as exceptions; an unknown or unverified component is not marked complete.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Confirm traceability, documentation accuracy, and the final upgrade boundary.

- [X] T013 Run every applicable command in `specs/011-atualizar-stack/quickstart.md` from a frozen-lockfile install and record the result/evidence in `docs/technology-upgrade-inventory.md`, including blocked integration/native checks and failing fixture-isolation tests.
- [X] T014 Search the root/workspace READMEs and `.specify/memory/constitution.md` for stale version claims, run `git diff --check`, and review the final diff to confirm there are no product feature changes, schema migrations, external database upgrades, or deployment-infrastructure changes. No stale claims or schema/service changes were found; plain diff-check reports only CRLF endings on the modified `.csproj` files, while the CRLF-aware check passes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 creates the inventory; T002 depends on T001 and establishes source-backed targets.
- **Foundational (Phase 2)**: T003 depends on T002 and blocks validation until pinned CI tools and isolated .NET testing are available.
- **User Story 1 (Phase 3)**: Depends on the foundational phase. T004 and T006 can run in parallel because they update separate JavaScript and .NET project files. T005 follows T004 because both the mobile manifest and JavaScript dependency changes are resolved into the same `bun.lock`. T007 follows all version changes; T008 follows T003–T007.
- **User Story 2 (Phase 4)**: Depends on the completed US1 inventory and validation. T009 identifies remaining gaps, T010 resolves them, T011 records/obtains approval for unavoidable exceptions, and T012 verifies the final state.
- **Polish (Phase 5)**: Depends on both user stories; T013–T014 are final acceptance and scope checks.

### User Story Dependencies

- **US1 (P1)**: Can start after Setup and Foundational. It delivers the core stable-version upgrades and validated application workspaces.
- **US2 (P2)**: Starts after US1 because it checks the post-upgrade inventory for residual support gaps and vulnerabilities. It is independently testable using the inventory and official support/advisory evidence.

### Parallel Opportunities

- **US1**: T004 (root/web/server/shared manifests) and T006 (.NET projects) may run in parallel after T003 and T002. T005 must not run in parallel with T004 because both affect Bun workspace dependency resolution and the shared lockfile.
- **US2**: No safe parallel tasks are identified; support review, remediation, exception approval, and final revalidation update the same inventory and may touch the same dependencies.

### Parallel Example: User Story 1

```text
Task: T004 Update root/web/server/shared dependency declarations.
Task: T006 Upgrade the .NET API and test project.
```

Run these only after target versions are confirmed and CI/test isolation is ready; integrate both before regenerating the shared lockfile and running final verification.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational tasks.
2. Complete US1 to update the core toolchains/frameworks and workspaces, then validate them independently.
3. Treat US1 as the first deliverable; do not declare the full feature complete until US2 has resolved or approved all support/advisory exceptions.

### Incremental Delivery

1. Build the baseline and official target matrix.
2. Pin toolchains and test isolation.
3. Upgrade JavaScript workspaces and .NET in parallel where files are independent; upgrade the mobile SDK sequentially and regenerate the lockfile after all related manifests are ready.
4. Update version documentation and run the complete verification matrix.
5. Review support/advisories, resolve remaining gaps or obtain approvals, then run final checks.

## Notes

- All tasks use unchecked checkboxes, sequential IDs, required story labels, and repository-relative paths.
- Do not run .NET integration tests without the disposable database configured in CI or locally.
- Exact version targets must be revalidated against official sources at implementation time.
- No dependency exception is approved implicitly by this task list.
