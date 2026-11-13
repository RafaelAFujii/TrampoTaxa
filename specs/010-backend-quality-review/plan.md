# Implementation Plan: Revisão da Qualidade do Backend

**Branch**: `[010-backend-quality-review]` | **Date**: 2026-11-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/010-backend-quality-review/spec.md`

## Summary

Deliver an evidence-based, read-only quality assessment of the user-selected .NET backend and a prioritized report. Add a bounded, descriptive performance baseline using a disposable isolated environment, without pass/fail targets until the owner defines them. Include a distinct follow-up cleanup plan for unusual backend pollution. The cleanup is gated on delivery of the assessment and separate user approval; it does not run as part of the read-only review.

The initial repository scan found **333 tracked files under the backend's `bin/` and `obj/` build-output directories**. These are the first cleanup candidates, not an instruction to delete them now. The cleanup phase must verify their generated nature and reproducibility, add backend-scoped ignore rules, and remove only approved generated outputs from version control.

## Technical Context

**Language/Version**: C# / .NET 8 (existing review target; no language or runtime migration)

**Primary Dependencies**: Existing ASP.NET Core API, Entity Framework Core with Npgsql, JWT authentication, BCrypt, Swagger; xUnit and `WebApplicationFactory` for integration tests. k6 is a separate HTTP load-test CLI, not an application or NuGet dependency.

**Storage**: PostgreSQL 15 is used by the backend. The assessment report is a repository artifact. Any tests that access the database must use a dedicated disposable database.

**Testing**: `dotnet build apps/server-dotnet/TrampoTaxa.sln`; `dotnet test apps/server-dotnet/tests/TrampoTaxa.Api.Tests/TrampoTaxa.Api.Tests.csproj` only after database isolation is verified; `k6 run --vus 10 --duration 30s --env BASE_URL=http://localhost:5286 apps/server-dotnet/tests/performance/baseline.js` only after a disposable isolated database and local API are ready. The API seeds data at startup and integration tests write records, so the existing local/default database is not a safe test target. The k6 baseline sends only read-only GET requests.

**Target Platform**: Existing .NET 8 backend; development and validation occur in an isolated checkout on the developer's supported .NET host. The current review environment is Windows.

**Project Type**: Existing web API under review; this feature adds review artifacts and a test-only load script, not API routes or runtime behavior.

**Performance Goals**: Produce a bounded baseline with 10 virtual users for 30 seconds against `GET /api/gigs`; record the workload, p95 latency, request throughput, and error rate. This profile is descriptive only and is not a production-capacity claim or pass/fail SLO.

**Constraints**: Review is read-only. Run the load baseline only against a disposable isolated environment with synthetic data; use GET endpoints only and never access production/shared databases. Do not expose secret values in reports or change backend behavior. Until targets are agreed, report metrics as a baseline without pass/fail. k6 is not installed in the current environment and must not be installed as part of planning. Cleanup is a separate, approval-gated workstream. Preserve unrelated worktree changes. Do not alter the Node/tRPC backend or client applications.

**Scale/Scope**: `apps/server-dotnet/src/TrampoTaxa.Api`, its unit/integration test project, a k6 baseline script under `apps/server-dotnet/tests/performance/`, solution, directly related configuration and documentation, plus tracked build artifacts under this backend. The review covers authentication/authorization, input validation, domain behavior, persistence, error handling, test quality, dependency/configuration risks, maintainability, and a bounded read-only performance baseline.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | Gate | Application to this plan |
|---|---|---|
| I. tRPC as the sole client/server contract | Pass with boundary | The user selected the existing .NET backend for assessment. The k6 script is a test-only load harness, not a shipped app client; no API routes, frontend clients, or production communication patterns are changed. The difference from the constitution's canonical tRPC backend is recorded as an existing architecture risk, not silently redesigned here. |
| II. Shared business logic and dumb client screens | Pass / not applicable | No client screens, `packages/shared`, or business-logic ownership is changed. |
| III. React Query and Zustand state ownership | Pass / not applicable | No client state is in scope. |
| IV. Metro workspace resolution | Pass / not applicable | No mobile or Metro configuration is changed. |
| V. Anti-bloat and repository hygiene | Pass | Keep the review report concise. Inventory unusual artifacts before cleanup; remove only verified, approved candidates. Add only narrowly scoped ignore rules needed for the backend. |
| VI. Strict TypeScript and test-first changes | Pass / not applicable to target | The target is the existing .NET backend. No behavior changes are planned. Any separately approved code change must have focused tests and preserve existing behavior. |
| Fail-closed security and RBAC | Pass | Inspect server-side authentication, authorization, configuration, and error paths. Never treat client visibility as authorization; do not use production credentials or data. |

**Gate result**: PASS. The plan does not introduce architecture or runtime changes that violate the constitution. The pre-existing distinction between the selected .NET backend and the canonical tRPC backend remains an assessment finding, not a scope expansion.

## Plan and Execution Boundaries

### Workstream 1 — Quality assessment (read-only)

1. Establish the exact source, tests, configuration, documentation, and API surface in scope.
2. Review correctness, access control, input and state validation, persistence and transaction behavior, error handling, secrets/configuration, dependency health, and test coverage.
3. Run safe static/build checks in an isolated checkout. Run integration tests only after confirming that the configured database is disposable and isolated. Run the bounded k6 baseline only against a disposable isolated local API/database and only for read-only GET routes.
4. Record every check as passed, failed, blocked, or not run. For each finding, include a location, impact, severity, confirmation status, and verification/reproduction guidance. For the load baseline, record the profile, p95 latency, throughput, and error rate; do not label it pass/fail until targets are agreed.
5. Produce the report contract in `contracts/quality-assessment-report.md`, including the cleanup-candidate inventory.

### Workstream 2 — Backend pollution cleanup (separate and approval-gated)

This is the additional cleanup plan requested by the user. It begins only after Workstream 1 has delivered its report and the user has approved the cleanup proposal.

1. Reconcile all tracked files under `apps/server-dotnet/**/bin/` and `apps/server-dotnet/**/obj/` against source, test fixtures, and runtime requirements. The current baseline is 333 tracked paths.
2. Confirm the outputs are reproducible from the solution and contain no hand-maintained inputs or required fixtures.
3. Propose scoped ignore entries for the backend's `bin/` and `obj/` directories and removal of approved generated outputs from version control.
4. Review any other unusual files individually. Do not classify a file as pollution from its name alone.
5. After approval, make only the approved hygiene changes, rebuild, run isolated tests, verify the generated outputs remain ignored, and report the resulting diff.

**Always preserve** source files, tests, test fixtures, required configuration/examples, migration/schema assets, and intentional documentation. Do not remove untracked or user-owned files. Do not delete all local build outputs merely because they are generated; only remove repository-tracked artifacts that have been approved.

## Project Structure

### Documentation (this feature)

```text
specs/010-backend-quality-review/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── review-report.md       # assessment deliverable, created during implementation
├── contracts/
│   ├── quality-assessment-report.md
│   └── backend-cleanup-proposal.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
apps/server-dotnet/
├── TrampoTaxa.sln
├── README.md
├── src/TrampoTaxa.Api/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   └── TrampoTaxa.Api.csproj
└── tests/
    ├── TrampoTaxa.Api.Tests/
    │   ├── IntegrationTests.cs
    │   └── TrampoTaxa.Api.Tests.csproj
    └── performance/
        └── baseline.js             # k6 baseline harness, created during implementation
```

**Structure Decision**: The selected target is the existing .NET API and its integration-test project. Deliverables include the review/design documents and one test-only k6 script under `apps/server-dotnet/tests/performance/`; no production source files or API routes are added or reorganized.

### Post-Design Constitution Gate

**Result: PASS.** Phase 1 adds review/design documentation and a test-only k6 script plan. It does not introduce runtime routes, ship a REST client, change client communication, alter shared business logic/state, or modify mobile configuration. The load baseline is isolated, read-only at the HTTP layer, and descriptive rather than an SLO; it will not run against production/shared data. The cleanup proposal remains read-only and approval-gated; generated artifacts will be removed only in a later, separately approved implementation. The existing .NET/tRPC ownership discrepancy remains documented as an assessment risk.

## Complexity Tracking

No constitution violations or runtime architectural components are introduced. k6 is an external test-only tool, not an application dependency. The existing backend-ownership discrepancy is documented for assessment only.
