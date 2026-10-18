---
description: 'Task list for the Engineering Foundation feature'
---

# Tasks: Engineering Foundation

**Input**: Design documents from `specs/001-engineering-foundation/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/change-release-gates.md`, `quickstart.md`

**Tests**: The constitution requires TDD for executable application behavior.
Release-exception validation changes must have Vitest tests written and observed
failing before implementation. Documentation and workflow behavior is verified by
the acceptance scenarios in `quickstart.md` and isolated GitHub workflow evidence.

**Organization**: Tasks are grouped by the specification's user stories. Completed
tasks reflect work already present in the repository; unchecked tasks are remaining
implementation or external verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it edits a separate file and has no incomplete-task dependency.
- **[Story]**: Story served by a task (`US1`, `US2`, or `US3`); setup, foundational, and polish tasks omit it.
- Every task includes its exact repository path or GitHub repository setting.

## Phase 1: Setup

**Purpose**: Prepare project quality measurement and distinguish repository work
from administrator-controlled prerequisites.

- [x] T001 Create `sonar-project.properties` for `apps/web`, `apps/mobile`, and `packages/shared`, defining source/test scopes and excluding only generated or non-source files.
- [ ] T002 Configure the protected GitHub Actions secret `SONAR_TOKEN` for `.github/workflows/quality.yml`, run Sonar analysis, and record the measured debt ratio and workflow evidence in `docs/quality-baseline.md`.

**Checkpoint**: Sonar configuration is committed. The protected secret and a successful
measurement remain external prerequisites; do not report an unmeasured baseline as
passing.

## Phase 2: Foundational

**Purpose**: Confirm current workspace scripts and canonical shared API paths before
using them in the required checks.

- [x] T003 Verify the workspace scripts and canonical paths in `package.json`, `apps/web/package.json`, `apps/mobile/package.json`, and `packages/shared/package.json`; fix the shared API ownership test's root-working-directory assumption in `packages/shared/src/api/api-generation.test.ts`.

**Checkpoint**: Required local commands, workspaces, and shared API ownership are
verified.

## Phase 3: User Story 1 - Deliver Changes Through a Predictable Workflow (Priority: P1)

**Goal**: Give contributors a repeatable process for proposing, validating, reviewing,
and releasing changes across Web, Mobile, shared code, and generated API artifacts.

**Independent Test**: Follow `CONTRIBUTING.md` for a representative change and confirm
the central PR template captures affected areas and evidence, the full required
validation runs on every PR, and deployment is bound to validation of the same
candidate revision.

### Implementation for User Story 1

- [x] T004 [P] [US1] Create `.github/pull_request_template.md` with change purpose, affected-area checkboxes for `apps/web`, `apps/mobile`, `packages/shared` (including API contract/generated client), and workflow/documentation, plus verification evidence, security/data impact, related risk records, and skipped checks.
- [x] T005 [P] [US1] Create `CONTRIBUTING.md` describing preparation, affected-area selection, required review, all-workspace validation, merge/release readiness, urgent-change escalation, and links to `SECURITY.md` and `docs/quality-baseline.md`.
- [x] T006 [P] [US1] Update `README.md` to link `CONTRIBUTING.md` and `SECURITY.md`, identify the Bun workspace boundaries, and identify `packages/shared/openapi.yaml` and `packages/shared/orval.config.ts` as canonical API sources.
- [x] T007 [US1] Create `.github/workflows/quality.yml` for pull requests targeting `main` and `master`, without path filters, and expose it through `workflow_call`; run root and workspace tests, Web lint/typecheck/build, Mobile typecheck/tests/Expo public configuration, shared tests, API generation, generated-artifact cleanliness, and Sonar; fail closed on missing checks, Sonar debt ratio `>= 10%`, or ESLint errors.
- [x] T008 [US1] Update `.github/workflows/deploy.yml` so push-based and manually dispatched Pages deployments validate the exact candidate revision and require successful validation and the security-risk gate before deployment.
- [x] T009 [P] [US1] Remove the divergent `docs/openapi.yaml` and update maintained OpenAPI references in `apps/web/docs/README.md`, `docs/RELATORIO_ETAPA_02_SECAO_3.md`, `apps/web/docs/RELATORIO_ETAPA_02_SECAO_3.md`, and `packages/shared/README.md` to point only to `packages/shared/openapi.yaml`; do not create another contract copy.
- [x] T010 [US1] Configure branch protection for `main` and `master` to require `Monorepo Quality Gate / Complete Monorepo Validation` and code-owner review, and record the required repository settings in `CONTRIBUTING.md`.

**Checkpoint**: Every PR receives the full validation matrix and Pages deployment
requires successful checks and security-risk evaluation for the same revision. The
release-exception extension is tracked separately under User Story 2.

## Phase 4: User Story 2 - Review Security Risks Before Release (Priority: P1)

**Goal**: Make security review and release-gate exceptions explicit, verifiable, and
time-bounded without treating local Mobile session state as end-to-end authentication.

**Independent Test**: Confirm malformed risk/exception records fail closed, unresolved
critical/high risks block release without valid approval, exceptions are bound to the
gate and candidate revision and expire within 30 calendar days, and missing or
unavailable required checks cannot be waived.

### Existing Security-Risk Policy

- [x] T011 [US2] Write Vitest coverage in `apps/web/src/__tests__/release-risk-gate.test.ts` for unresolved critical/high risks, valid and invalid exceptions, resolved risks with evidence, and missing or malformed risk-register data; verify the tests fail before implementing the policy.
- [x] T012 [US2] Create `docs/security-risks.json` with uniquely identified, owned open risks for Web simulated authentication, Mobile end-to-end login/token issuance, and server-side authorization; do not describe delivered Mobile session state or protected navigation as absent.
- [x] T013 [US2] Implement `apps/web/scripts/check-release-risks.ts` to validate risk-register structure and evidence, fail closed on malformed/missing data, and block unresolved critical/high risks without a verified exception approver.
- [x] T014 [P] [US2] Create `SECURITY.md` documenting private vulnerability reporting, severity triage, secret handling, response ownership, remediation evidence, the urgent security-fix path, and time-bounded exception requirements.
- [x] T015 [US2] Integrate `bun run apps/web/scripts/check-release-risks.ts` into `.github/workflows/deploy.yml` before Pages deployment; invalid risk data or unresolved blocking risks must prevent deployment.
- [x] T016 [US2] Add regression cases in `apps/web/src/__tests__/release-risk-gate.test.ts` for HIGH-minimum severity, required risk records, verified security-owner approval, fallback maintainer approval, and expired, malformed, incomplete, or unauthorized exceptions.

### Time-Bounded Release Exceptions

> Write the tests first and confirm the new cases fail for the intended reason before
> changing either release-exception validator.

- [x] T017 [P] [US2] Add cases in `apps/web/src/__tests__/release-risk-gate.test.ts` requiring `gate`, candidate `revision`, verified `approvedBy`, `approvedAt`, `rationale`, `scope`, and `expiresAt`; reject expiry beyond 30 calendar days, expired approval, invalid dates, and unauthorized approvers.
- [x] T018 [P] [US2] Create `apps/web/src/__tests__/release-exception-gate.test.ts` covering a valid exception, unknown gate, mismatched candidate revision, expired and over-30-day expiry, malformed/incomplete data, unauthorized approver, and missing or unavailable check evidence.
- [x] T019 [P] [US2] Create `docs/release-exceptions.json` as the machine-readable register for non-security gate exceptions, initially with an empty `exceptions` array and no fabricated approvals.
- [x] T020 [US2] Update `apps/web/scripts/check-release-risks.ts` to require exception gate, candidate revision, approval date, and expiry, and enforce: "Expiry must be within 30 calendar days of approval; extension requires a new approval before expiry"; retain fail-closed behavior for absent or invalid evidence.
- [x] T021 [US2] Implement `apps/web/scripts/check-release-exceptions.ts` to validate `docs/release-exceptions.json`, reuse verified approvers from `docs/ownership.md`, bind each record to an existing mandatory gate and candidate revision, enforce the 30-calendar-day expiry, and reject missing or unavailable check evidence.
- [x] T022 [US2] Update `.github/workflows/quality.yml` to expose the outcomes of required checks to release validation without allowing an exception to make the required pull-request quality workflow pass.
- [x] T023 [US2] Update `.github/workflows/deploy.yml` to invoke `bun run apps/web/scripts/check-release-exceptions.ts` for the exact deployment revision and permit only an explicitly approved exception for an available failed gate; missing or unavailable required checks must still block Pages deployment.

**Checkpoint**: Security and non-security gate exceptions are tied to a real release
revision, have verified approval evidence, expire within 30 calendar days, and cannot
override missing verification.

## Phase 5: User Story 3 - Understand and Improve System Health (Priority: P2)

**Goal**: Give maintainers a visible quality baseline and verified ownership for
application, security, and release areas.

**Independent Test**: A maintainer can identify the source, threshold, cadence, owner,
and disposition for each quality measure, distinguish a real pass from missing
evidence, and find verified review owners for each protected area.

### Implementation for User Story 3

- [x] T024 [P] [US3] Create `docs/quality-baseline.md` defining the source, threshold, measurement cadence, accountable role, and failure response for Sonar debt ratio `< 10%`, ESLint errors `0`, workspace tests, type checks, builds, and generated API cleanliness.
- [x] T025 [US3] Update `docs/quality-baseline.md` to document the 30-calendar-day exception limit, non-waivable missing/unavailable measurements, and the current Sonar result as unmeasured until a successful workflow run is recorded.
- [x] T026 [US3] Create `.github/CODEOWNERS` mapping `apps/web/`, `apps/mobile/`, `packages/shared/`, `.github/`, `docs/security-risks.json`, `docs/release-exceptions.json`, and `SECURITY.md` to verified identities in `docs/ownership.md`.

**Checkpoint**: Quality status is evidence-based, and protected repository areas route
reviews to verified owners.

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: Keep implementation, policy documentation, and the plan's release-gate
contract consistent.

- [x] T027 [P] Review `CONTRIBUTING.md`, `SECURITY.md`, `.github/pull_request_template.md`, `docs/ownership.md`, `.github/workflows/quality.yml`, and `.github/workflows/deploy.yml` against `specs/001-engineering-foundation/contracts/change-release-gates.md`; correct conflicting instructions.
- [x] T028 [P] Search maintained documentation and workflows for obsolete OpenAPI paths and claims that Mobile lacks a session context; update `README.md`, `apps/web/README.md`, `apps/web/docs/README.md`, `apps/mobile/README.md`, `packages/shared/README.md`, and `docs/` to reflect the canonical contract and current risk status.
- [x] T029 Update `SECURITY.md`, `docs/security-risks.json`, `specs/001-engineering-foundation/data-model.md`, `specs/001-engineering-foundation/contracts/change-release-gates.md`, and `specs/001-engineering-foundation/quickstart.md` to use the implemented exception fields, approval rules, expiry calculation, and validation commands.
- [x] T030 Run the local scenarios in `specs/001-engineering-foundation/quickstart.md`, including root/workspace tests, lint/type checks, Web build, Expo configuration, API regeneration, release-risk tests, and release-exception tests; confirm current unresolved authentication risks still block deployment.
- [ ] T031 In an isolated non-production GitHub environment without production Pages publishing capability, verify that failed validation, the risk gate, and invalid/expired exceptions skip deployment while an exception cannot waive a missing or unavailable required check; record workflow evidence in `specs/001-engineering-foundation/quickstart.md`.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 is complete. T002 requires a repository administrator and a real SonarCloud run; it is needed to record the measured baseline but does not block local implementation.
- **Foundational (Phase 2)**: T003 is complete and establishes verified commands and paths.
- **US1 (Phase 3)**: T004-T010 are complete and can be reviewed independently.
- **US2 (Phase 4)**: Existing risk controls T011-T016 are complete. T017-T018 must fail before T020-T021 are implemented. T019 may proceed in parallel with the test authoring. T022 depends on the validation outcomes being defined by T020-T021; T023 depends on T022 and both validators.
- **US3 (Phase 5)**: T024 is complete. T025 and T026 can proceed independently after the confirmed owner data in `docs/ownership.md` is checked.
- **Polish (Phase 6)**: T029 follows T017-T026; T030 follows all implementation/documentation tasks; T031 requires the isolated GitHub environment and must not use production publishing capability.

### User Story Dependencies

- **US1 (P1)**: Depends on Setup and Foundational; its completed workflow is the base for release integration.
- **US2 (P1)**: Extends the existing US1 deployment pipeline. Its local exception tests and data model can proceed in parallel, but workflow deployment integration follows both validators.
- **US3 (P2)**: Quality-baseline and CODEOWNERS work can proceed independently after Setup and Foundational. Actual Sonar measurement depends on T002.

### Parallel Opportunities

- **Setup**: T001 is complete; T002 is an administrator-controlled prerequisite.
- **US1**: T004, T005, and T006 use separate files and were independently implementable; T009 is separate from these API-guide updates.
- **US2**: T017 and T018 edit separate test files; T019 can be authored alongside them. T020 and T021 touch separate TypeScript scripts after the corresponding tests are in place.
- **US3**: T025 and T026 edit separate documentation/configuration files and can run in parallel.
- **Polish**: T029 may be prepared while test/validator work completes, but final acceptance in T030-T031 waits for implementation and integration.

### Parallel Example: User Story 2

```text
Task: T017 Add security-risk exception boundary tests in apps/web/src/__tests__/release-risk-gate.test.ts
Task: T018 Add general release-exception tests in apps/web/src/__tests__/release-exception-gate.test.ts
Task: T019 Create the empty non-security exception register in docs/release-exceptions.json
```

### Parallel Example: User Story 3

```text
Task: T025 Update quality exception and measurement status in docs/quality-baseline.md
Task: T026 Create verified CODEOWNERS mappings in .github/CODEOWNERS
```

## Implementation Strategy

### MVP First (User Story 1)

1. Confirm Setup and Foundational prerequisites.
2. Deliver the documented contributor workflow, standard PR template, full PR
   validation, canonical OpenAPI references, and same-revision deployment gate.
3. Validate that documentation-only and shared-only PRs run the complete check matrix.
4. Treat US1 as workflow MVP only; it does not certify authentication or waive the
   release blocks for unresolved high/critical security risks.

### Incremental Delivery

1. Setup + Foundational: verified workspace paths and quality configuration.
2. US1: consistent PR checks and deployment gating.
3. US2: tests-first, revision-bound and time-bounded release-exception controls.
4. US3: evidence-based quality reporting and verified owner routing.
5. Polish: validate the quickstart and isolated deployment behavior.

## Notes

- Every task follows the checkbox, sequential task ID, applicable `[P]`/`[US#]`
  labels, and exact-path requirements. Completed tasks remain checked; pending tasks
  use unchecked boxes.
- `[P]` tasks edit different files and have no unmet dependencies.
- TDD applies to executable exception-policy behavior; T017-T018 must fail before
  T020-T021 are implemented.
- API contract ownership, generated mock exports, and Mobile session implementation
  were delivered under the separate architecture-refactoring feature and are not
  reimplemented here.
- Web authentication, Mobile end-to-end token issuance, and server-side authorization
  remain open security risks until separately verified.
