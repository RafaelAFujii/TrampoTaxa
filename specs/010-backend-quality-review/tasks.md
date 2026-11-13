# Tasks: Revisão da Qualidade do Backend

**Input**: Design documents from `specs/010-backend-quality-review/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: No new API unit/integration tests are requested. FR-011 requires a test-only k6 HTTP baseline; run it only against a verified disposable local database and API. Existing integration tests also require a verified disposable database.

**Organization**: Tasks are grouped by user story. The assessment is read-only. The cleanup workstream produces a proposal only; it does not remove files or edit ignore rules.

## Format: `- [ ] Tnnn [P?] [USn] Description with file path`

- **[P]**: Use only when tasks can safely operate on different files without dependencies.
- **[Story]**: User-story label required for story tasks.
- Each task includes the repository-relative file path(s) it reads or updates.

## Phase 1: Setup

**Purpose**: Create the assessment deliverable and record a safe baseline.

- [X] T001 Create the assessment report skeleton from `specs/010-backend-quality-review/contracts/quality-assessment-report.md` in `specs/010-backend-quality-review/review-report.md`, including scope, checks, findings, cleanup proposal, and actions.
- [X] T002 Record the starting Git status and the tracked backend `bin/` and `obj/` inventory in `specs/010-backend-quality-review/review-report.md`; preserve all pre-existing worktree changes.

---

## Phase 2: Foundational

**Purpose**: Confirm scope and safety conditions before reviewing or running checks.

- [X] T003 Confirm the review boundary from `specs/010-backend-quality-review/plan.md` and `apps/server-dotnet/README.md`; list included and excluded components in `specs/010-backend-quality-review/review-report.md`.
- [X] T004 Verify test safety by reviewing `apps/server-dotnet/src/TrampoTaxa.Api/Program.cs`, `apps/server-dotnet/src/TrampoTaxa.Api/Data/DbInitializer.cs`, and `apps/server-dotnet/tests/TrampoTaxa.Api.Tests/IntegrationTests.cs`; document the disposable-database requirement in `specs/010-backend-quality-review/review-report.md`.

**Checkpoint**: Do not run integration tests until T004 confirms an isolated disposable database can be used.

---

## Phase 3: User Story 1 — Obter uma avaliação confiável do backend (Priority: P1) 🎯 MVP

**Goal**: Produce an evidence-based assessment of the selected .NET backend and a clear readiness conclusion.

**Independent Test**: `specs/010-backend-quality-review/review-report.md` identifies all in-scope production components and contains evidence, impact, severity, and verification guidance for each confirmed finding.

### Review and report

- [X] T005 [US1] Review authorization, request validation, business behavior, and error handling in `apps/server-dotnet/src/TrampoTaxa.Api/Controllers/AuthController.cs`, `apps/server-dotnet/src/TrampoTaxa.Api/Controllers/ChatController.cs`, `apps/server-dotnet/src/TrampoTaxa.Api/Controllers/ContractorController.cs`, `apps/server-dotnet/src/TrampoTaxa.Api/Controllers/FreelancerController.cs`, `apps/server-dotnet/src/TrampoTaxa.Api/Controllers/GigsController.cs`, and `apps/server-dotnet/src/TrampoTaxa.Api/Program.cs`; record evidence and architecture-boundary risks in `specs/010-backend-quality-review/review-report.md` without exposing secret values.
- [X] T006 [US1] Review persistence, entity relationships, DTOs, seed behavior, and token handling in `apps/server-dotnet/src/TrampoTaxa.Api/Data/AppDbContext.cs`, `apps/server-dotnet/src/TrampoTaxa.Api/Data/DbInitializer.cs`, `apps/server-dotnet/src/TrampoTaxa.Api/DTOs/Dtos.cs`, `apps/server-dotnet/src/TrampoTaxa.Api/Models/Entities.cs`, and `apps/server-dotnet/src/TrampoTaxa.Api/Services/TokenService.cs`; record relevant findings in `specs/010-backend-quality-review/review-report.md`.
- [X] T007 [US1] Review dependency and configuration risks in `apps/server-dotnet/src/TrampoTaxa.Api/TrampoTaxa.Api.csproj`, `apps/server-dotnet/src/TrampoTaxa.Api/appsettings.json`, `apps/server-dotnet/src/TrampoTaxa.Api/appsettings.Development.json`, and `apps/server-dotnet/tests/TrampoTaxa.Api.Tests/TrampoTaxa.Api.Tests.csproj`; record locations and impacts, never secret values, in `specs/010-backend-quality-review/review-report.md`.
- [X] T008 [US1] Review critical-flow coverage and edge cases in `apps/server-dotnet/tests/TrampoTaxa.Api.Tests/IntegrationTests.cs`; record covered areas, gaps, and limitations in `specs/010-backend-quality-review/review-report.md`.
- [X] T009 [US1] Consolidate findings in `specs/010-backend-quality-review/review-report.md` using the categories and severity definitions from `specs/010-backend-quality-review/contracts/quality-assessment-report.md` and `specs/010-backend-quality-review/spec.md`; set readiness based on evidence and limitations.

**Checkpoint**: The MVP assessment is independently reviewable; no source code, configuration, or data has been changed.

---

## Phase 4: User Story 2 — Distinguir resultados verificados de limitações (Priority: P2)

**Goal**: Show exactly which automated checks passed, failed, were blocked, or were not run, including the bounded performance baseline required by FR-011.

**Independent Test**: The checks section of `specs/010-backend-quality-review/review-report.md` lists each command and observed result; unavailable checks include a reason and are not represented as passing. If the k6 baseline runs, it records the isolated environment, 10-VU/30-second profile, p95 latency, throughput, and error rate without pass/fail SLO claims.

### Verification

- [X] T010 [US2] Check SDK availability and run `dotnet build apps/server-dotnet/TrampoTaxa.sln` in an isolated checkout when available; otherwise record the blocked reason and evidence in `specs/010-backend-quality-review/review-report.md`.
- [X] T011 [US2] Run `dotnet test apps/server-dotnet/tests/TrampoTaxa.Api.Tests/TrampoTaxa.Api.Tests.csproj` only if T004 confirms a disposable isolated database; otherwise mark the check blocked and explain why in `specs/010-backend-quality-review/review-report.md`.
- [X] T012 [US2] Reconcile the build and test results in `specs/010-backend-quality-review/review-report.md` with the status contract in `specs/010-backend-quality-review/contracts/quality-assessment-report.md`; record every check as passed, failed, blocked, or not-run.

### Performance baseline

- [X] T013 [US2] Create `apps/server-dotnet/tests/performance/baseline.js` as a k6 harness using `BASE_URL`, 10 virtual users for 30 seconds, and only `GET /api/gigs`; reject non-loopback origins and do not add pass/fail thresholds, API routes, or NuGet dependencies.
- [X] T014 [US2] Follow section 4 of `specs/010-backend-quality-review/quickstart.md` to start the API with a disposable isolated database and temporary local signing key, then run `k6 run --vus 10 --duration 30s --env BASE_URL=http://localhost:5286 apps/server-dotnet/tests/performance/baseline.js` only when the .NET SDK, k6, and synthetic test data are available; otherwise record the specific blocker in `specs/010-backend-quality-review/review-report.md`. Record the environment, profile, p95 latency, throughput, and error rate in that report, treating results as a baseline without SLO pass/fail.

**Checkpoint**: No unavailable or unsafe check is reported as successful.

---

## Phase 5: User Story 3 — Priorizar as próximas ações (Priority: P3)

**Goal**: Deliver a safe, actionable proposal for unusual backend pollution without performing cleanup.

**Independent Test**: `specs/010-backend-quality-review/review-report.md` contains a cleanup-candidate inventory with paths, classification, evidence, and pending approval; no candidate has been removed.

### Cleanup proposal only

- [X] T015 [US3] Recount tracked paths under `apps/server-dotnet/**/bin/**` and `apps/server-dotnet/**/obj/**`; record directory-level candidates and counts in the cleanup section of `specs/010-backend-quality-review/review-report.md`.
- [X] T016 [US3] Verify candidate build outputs against `apps/server-dotnet/TrampoTaxa.sln`, the source tree under `apps/server-dotnet/src/TrampoTaxa.Api/`, and fixtures/tests under `apps/server-dotnet/tests/TrampoTaxa.Api.Tests/`; document regeneration and usage evidence in `specs/010-backend-quality-review/review-report.md`.
- [X] T017 [US3] Prepare a backend-scoped ignore/removal proposal in `specs/010-backend-quality-review/review-report.md` using `specs/010-backend-quality-review/contracts/backend-cleanup-proposal.md`; leave approval pending and do not edit `.gitignore` or remove/untrack files.

**Checkpoint**: The proposal is complete, but cleanup has not been executed and remains subject to separate user approval.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate report quality, safety, and preservation of existing work.

- [X] T018 Validate `specs/010-backend-quality-review/review-report.md` against `specs/010-backend-quality-review/contracts/quality-assessment-report.md` and `specs/010-backend-quality-review/spec.md`; confirm scope coverage, severity, evidence, check states, cleanup approval status, and absence of secret values.
- [X] T019 Run `git diff --check` and inspect `git status --short`; record in `specs/010-backend-quality-review/review-report.md` that no production source, runtime configuration, or data was changed, the k6 harness is test-only, and pre-existing user changes were preserved.
- [X] T020 Validate `apps/server-dotnet/tests/performance/baseline.js` and the performance-check entry in `specs/010-backend-quality-review/review-report.md` against `specs/010-backend-quality-review/contracts/quality-assessment-report.md`, `specs/010-backend-quality-review/spec.md`, and `specs/010-backend-quality-review/quickstart.md`; confirm loopback-only target validation, GET-only behavior, isolation, metric coverage, and baseline-only evaluation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001 precedes T002 because the report must exist before recording the baseline.
- **Foundational (Phase 2)**: Follows Setup; T003 and T004 establish scope and test safety before review or execution.
- **User Story 1 (Phase 3)**: Depends on the foundational checkpoint; the review tasks are sequenced because they contribute to the same report.
- **User Story 2 (Phase 4)**: Depends on T004. It is scheduled after US1 so build/test and k6 baseline results can be incorporated into the same report without conflicting edits. T014 depends on T013 and on safe local prerequisites; unavailable prerequisites result in a documented blocked check.
- **User Story 3 (Phase 5)**: Depends on the assessment and verification results; it produces a proposal only.
- **Polish (Phase 6)**: Depends on all three user stories and T014; T020 validates the harness and any recorded baseline or blocker.

### User Story Dependencies

- **US1 (P1)**: Depends on Setup and Foundational; no dependency on another user story.
- **US2 (P2)**: Depends on Foundational safety checks; conceptually independent of US1, but scheduled after it to consolidate evidence in one report. T013 creates the harness, and T014 runs it only when the disposable environment and tools are available.
- **US3 (P3)**: Depends on the completed assessment and verification record; cleanup remains approval-gated.

### Parallel Opportunities

- **US1**: No safe parallel task markers. Each review area contributes to the same report, so parallel edits could conflict or lose findings.
- **US2**: No safe parallel task markers. T014 depends on the T013 harness; build, integration, and load tests require safe isolated environments, and outcomes are consolidated into the same report.
- **US3**: No safe parallel task markers. Candidate classification depends on the completed review and shares the same cleanup proposal section.

No tasks are marked `[P]`, so there are no safe parallel execution examples for the pending work. Avoid concurrent edits to `review-report.md` or concurrent build/test operations in a shared checkout.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational tasks.
2. Complete US1 to deliver the source-quality assessment and evidence-based conclusion.
3. Treat this as an initial value milestone only; the full specification is not complete until US2 records automated check outcomes.

### Incremental Delivery

1. Complete US1 and review the findings.
2. Complete US2 with safe build/test results and the k6 baseline, or explicit blocked/not-run reasons for unavailable checks.
3. Complete US3 with the separate cleanup proposal, leaving all candidate approvals pending.
4. Complete Polish and confirm the audit did not modify backend code, configuration, or data.

## Notes

- Every task uses the required checkbox, sequential ID, optional story label, and repository-relative file path.
- No new API unit/integration tests are added. The required k6 harness is test-only and the baseline is executed only under the safety conditions above.
- The cleanup plan does not authorize file removal. Obtain separate user approval before implementing any cleanup changes.
