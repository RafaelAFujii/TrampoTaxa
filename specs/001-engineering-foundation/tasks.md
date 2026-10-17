---
description: 'Task list for the Engineering Foundation feature'
---

# Tasks: Engineering Foundation

**Input**: Design documents from `specs/001-engineering-foundation/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/change-release-gates.md`, `quickstart.md`

**Tests**: The constitution requires TDD for executable application behavior. The
release-risk policy is executable TypeScript logic, so its Vitest tests are written
first. Workflow and documentation behavior is verified through CI/workflow review
and the acceptance checks in `quickstart.md`.

**Organization**: Tasks are grouped by user story and ordered by prerequisite. User
stories are independently verifiable after shared setup.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because tasks edit different files and have no
  incomplete-task dependency.
- **[Story]**: User story served by a task (`US1`, `US2`, or `US3`).
- Every task specifies its repository file path or the repository setting it configures.

## Phase 1: Setup

**Purpose**: Establish verifiable project ownership and Sonar prerequisites without
inventing maintainer identities or committing credentials.

- [x] T001 [P]: Await maintainer confirmation of actual GitHub team/user handles, then record verified project-area roles and contacts in `docs/ownership.md`; do not fabricate identities.
- [x] T002 [P]: A repository administrator must configure the protected `SONAR_TOKEN` secret for `.github/workflows/quality.yml`; the confirmed public SonarCloud organization/project key are in `sonar-project.properties`, but no analysis is passing until the secret is configured.
- [x] T003 [P] Create `sonar-project.properties` for `apps/web`, `apps/mobile`, and `packages/shared`, defining source/test scopes and excluding only generated or non-source files.

---

## Phase 2: Foundational

**Purpose**: Confirm the boundaries and validation commands that all stories must
preserve before implementing the workflow.

- [x] T004 Verify the workspace scripts and canonical paths in `package.json`, `apps/web/package.json`, `apps/mobile/package.json`, and `packages/shared/package.json`; fix the shared API ownership test's root-working-directory assumption in `packages/shared/src/api/api-generation.test.ts`.

**Checkpoint**: Verified ownership and Sonar prerequisites are known, existing workspace
commands are confirmed, and implementation can proceed without assuming missing
maintainer identities or Mobile authentication behavior.

---

## Phase 3: User Story 1 - Deliver Changes Through a Predictable Workflow (Priority: P1)

**Goal**: Give contributors a single path for submitting, validating, reviewing, and
releasing changes across Web, Mobile, shared code, and API artifacts.

**Independent Test**: Follow `CONTRIBUTING.md` for a representative change and verify
that the standard PR template captures affected areas and evidence, the required
quality workflow runs the complete matrix on every PR, and a production deployment
cannot proceed unless the same revision passes validation.

### Implementation for User Story 1

- [x] T005 [P] [US1] Create `.github/pull_request_template.md` with change purpose, checkboxes for `apps/web`, `apps/mobile`, `packages/shared` (including API contract/generated client), plus verification evidence, security/data impact, related risk records, and skipped checks.
- [x] T006 [P] [US1] Create `CONTRIBUTING.md` describing preparation, affected-area selection, required review, all-workspace validation, merge/release readiness, urgent-change escalation, and links to `SECURITY.md` and `docs/quality-baseline.md`.
- [x] T007 [P] [US1] Update `README.md` to link `CONTRIBUTING.md` and `SECURITY.md`, identify the Bun workspace boundaries, and refer to `packages/shared/openapi.yaml` and `packages/shared/orval.config.ts` as the canonical API sources.
- [x] T008 [US1] Create `.github/workflows/quality.yml` for pull requests targeting `main` and `master`, without path filters, and expose it through `workflow_call` for release reuse; run root tests, Web lint/typecheck and build, Mobile tests/typecheck/Expo public configuration, shared tests, `bun run api:generate`, generated-artifact cleanliness verification, and Sonar analysis; fail closed on missing checks, Sonar debt ratio `>= 10%`, or ESLint errors.
- [x] T009 [US1] Update `.github/workflows/deploy.yml` so push-based and manually dispatched Pages deployments call the reusable validation workflow for the exact candidate revision and deploy only after that validation succeeds.
- [x] T010 [US1] Remove the divergent `docs/openapi.yaml` and update maintained OpenAPI references in `README.md`, `apps/web/docs/README.md`, `docs/RELATORIO_ETAPA_02_SECAO_3.md`, `apps/web/docs/RELATORIO_ETAPA_02_SECAO_3.md`, and `packages/shared/README.md` to point only to `packages/shared/openapi.yaml`; do not create another contract copy.
- [ ] T011 BLOCKED: Repository administrator must enable branch protection for `main` and `master` using the required status check `Monorepo Quality Gate / Complete Monorepo Validation` and required code-owner review; configuration status is documented in `CONTRIBUTING.md`.

**Checkpoint**: PR validation covers all workspaces regardless of paths, the API
generator uses the shared contract, and Pages deployment is gated on successful
validation of the candidate revision.

---

## Phase 4: User Story 2 - Review Security Risks Before Release (Priority: P1)

**Goal**: Make security-sensitive review actionable and ensure unresolved
authentication/authorization gaps cannot be silently treated as completed controls.

**Independent Test**: Verify that the risk policy rejects missing or malformed data
and blocks any unresolved critical/high risk without a valid, approved, non-expired
exception; confirm Mobile's delivered local session controls are not listed as
missing and do not stand in for end-to-end token issuance or server authorization.

### Tests for User Story 2

> Write these tests first and confirm they fail for the expected reasons before
> implementing the risk policy.

- [x] T012 [US2] Write Vitest cases in `apps/web/src/__tests__/release-risk-gate.test.ts` for unresolved critical/high risks, valid versus expired/incomplete exceptions, resolved risks with evidence, and missing/malformed risk-register data; verify the new tests fail before implementation.

### Implementation for User Story 2

- [x] T013 [US2] Create `docs/security-risks.json` with uniquely identified, owned open risks for Web simulated authentication, end-to-end Mobile login/token issuance, and server-side authorization; assign severity/status/disposition using the documented triage policy and do not describe the delivered Mobile session context or protected navigation as absent.
- [x] T014 [US2] Implement `apps/web/scripts/check-release-risks.ts` to validate the risk-register shape and evidence, fail closed on missing/malformed data, and block unresolved critical/high risks unless an exception has an approver, rationale, scope, and future expiry.
- [x] T015 [P] [US2] Create `SECURITY.md` documenting private vulnerability reporting, severity triage, secret handling, response ownership, remediation evidence, the urgent security-fix path, and the constitution's time-bounded exception requirements.
- [x] T016 [US2] Integrate `bun run apps/web/scripts/check-release-risks.ts` into `.github/workflows/deploy.yml` after the reusable validation job and before Pages deployment; missing/invalid risk data or an unresolved blocking risk must prevent deployment.

**Checkpoint**: Security gaps have explicit owners and dispositions; Pages deployment
is blocked by unresolved critical/high risks unless a constitution-compliant exception
is documented and valid.

---

## Phase 5: User Story 3 - Understand and Improve System Health (Priority: P2)

**Goal**: Give maintainers a current quality baseline and verified ownership for each
major workspace and operational area.

**Independent Test**: A maintainer can locate verified owners, determine where each
quality indicator is measured, distinguish a measured pass from missing evidence, and
identify the remediation path for a failed indicator.

### Implementation for User Story 3

- [x] T017 [P] [US3] Create `docs/quality-baseline.md` defining the source, threshold, measurement cadence, accountable role, and failure response for Sonar debt ratio `< 10%`, ESLint errors `0`, workspace tests, type checks, builds, and generated API cleanliness.
- [ ] T018 BLOCKED: Create `.github/CODEOWNERS` only after verified GitHub identities are supplied for `apps/web/`, `apps/mobile/`, `packages/shared/`, `.github/`, `docs/security-risks.json`, `SECURITY.md`, and release configuration; do not use placeholders.
- [ ] T019 BLOCKED: ESLint has a local passing result recorded in `docs/quality-baseline.md`; a repository administrator must configure `SONAR_TOKEN` and run a real analysis before the Sonar baseline can be completed.

**Checkpoint**: Each major project area has a verified owner and each required quality
indicator has a measurable source, threshold, cadence, and recorded baseline state.

---

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: Reconcile implementation, maintained documentation, and acceptance
criteria without changing the separately delivered architecture refactor.

- [x] T020 [P] Review `CONTRIBUTING.md`, `SECURITY.md`, `.github/pull_request_template.md`, ownership limitations, `.github/workflows/quality.yml`, and `.github/workflows/deploy.yml` against `specs/001-engineering-foundation/contracts/change-release-gates.md`; correct conflicting instructions.
- [x] T021 [P] Search maintained documentation and workflows for obsolete OpenAPI paths and claims that Mobile lacks a session context; update stale references in `README.md`, `apps/web/README.md`, `apps/web/docs/README.md`, `apps/mobile/README.md`, `packages/shared/README.md`, and `docs/` to the canonical contract and current risk status.
- [x] T022 Execute the local validation scenarios in `specs/001-engineering-foundation/quickstart.md`, including root/workspace tests, lint/type checks, Web build, Expo configuration, API regeneration, and generated-output stability.
- [ ] T023 BLOCKED: Evidence that `.github/workflows/quality.yml` runs on documentation-only/shared-only PRs and `.github/workflows/deploy.yml` cannot deploy after failed validation/risk checks requires actual GitHub PR/workflow runs; local syntax and policy checks are complete.

## Phase 7: Restore and Validate the Release-Risk Gate

**Purpose**: Enforce the clarified authentication/authorization severity policy and
prevent undocumented or unverified exceptions from allowing production release.

- [x] T024 [US2] Add regression tests in `apps/web/src/__tests__/release-risk-gate.test.ts` for HIGH-minimum severity, required risk records, valid verified-owner exceptions, fallback maintainer approval, and expired, malformed, incomplete, or unauthorized exceptions.
- [x] T025 [US2] Update `apps/web/scripts/check-release-risks.ts` to require HIGH or CRITICAL severity and all required authentication/authorization risk records, validate exception fields and expiry, and authorize only identities verified in `docs/ownership.md`.
- [x] T026 [US2] Update `docs/security-risks.json` so Web authentication, Mobile end-to-end authentication, and server authorization remain open at HIGH severity without unverified exceptions.
- [x] T027 [US2] Align `docs/ownership.md`, `SECURITY.md`, `specs/001-engineering-foundation/data-model.md`, `specs/001-engineering-foundation/contracts/change-release-gates.md`, and `specs/001-engineering-foundation/quickstart.md` with the exception approval and blocking policy.
- [x] T028 Run the release-risk tests and local release gate; confirm tests pass and the actual open risks produce a non-zero block without attempting deployment.
- [ ] T029 In an isolated non-production GitHub environment without production Pages publishing capability, separately fail validation and the risk gate; retain workflow evidence showing deployment is skipped.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001, T002, and T003 can start immediately; T002 requires
  repository/Sonar administration but does not depend on code changes.
- **Foundational (Phase 2)**: T004 follows initial setup and blocks story work until
  current scripts and workspace paths have been verified.
- **US1 (Phase 3)**: Depends on Phase 2. T005, T006, and T007 can proceed in parallel.
  T008 depends on the verified commands and configured Sonar; T009 depends on T008;
  T010 edits documentation/files separate from workflows; T011 follows T008 once its
  emitted check names are stable.
- **US2 (Phase 4)**: T012 tests precede T014 implementation; T013 provides the input
  data for T014 validation. T015 is independent. T016 follows both T009 and T014.
- **US3 (Phase 5)**: T017 can proceed independently; T018 depends on verified handles
  from T001; T019 depends on T002, T003, and a successful analysis workflow.
- **Polish (Phase 6)**: T020-T023 follow the workflow, risk-gate, ownership, and
  baseline tasks they validate.

### User Story Dependencies

- **US1 (P1)**: Depends on Setup and Foundational phases; independent of US2 and US3.
- **US2 (P1)**: Risk-register and policy work depends on Setup and Foundational; the
  production integration task depends on US1's deployment workflow.
- **US3 (P2)**: Quality baseline can start after Setup; CODEOWNERS depends on verified
  ownership data from T001. It does not require US2.

### Parallel Opportunities

- **Setup**: T001, T002, and T003 may proceed independently.
- **US1**: T005, T006, T007, and T010 edit separate files; T008 must precede T009 and
  T011.
- **US2**: T012, T013's risk-data authoring prerequisite, and T015 can be prepared in
  parallel where files differ; T014 must wait for T012 and T013, and T016 must wait
  for the release workflow and policy implementation.
- **US3**: T017 can run independently; T018 waits for verified owner identities; T019
  waits for working Sonar configuration and a successful analysis.
- **Across stories**: US1 documentation and US3 quality documentation can proceed in
  parallel after foundational path verification; US2's tests and security policy can
  proceed in parallel with those documentation tasks.

### Parallel Example: User Story 1

```text
Task: T005 Create the central PR template in .github/pull_request_template.md
Task: T006 Create contributor workflow guidance in CONTRIBUTING.md
Task: T007 Update root workspace and canonical API links in README.md
Task: T010 Remove the divergent contract and update its references
```

### Parallel Example: User Story 2

```text
Task: T012 Write release-risk gate tests in apps/web/src/__tests__/release-risk-gate.test.ts
Task: T013 Prepare security risk records in docs/security-risks.json
Task: T015 Create vulnerability and exception policy in SECURITY.md
```

### Parallel Example: User Story 3

```text
Task: T017 Define measurable gates in docs/quality-baseline.md
Task: T018 Map verified owners in .github/CODEOWNERS (after T001)
```

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Setup and Foundational phases.
2. Complete US1: publish contributor guidance and template, run full PR validation,
   remove API contract ambiguity, and make Pages deployment depend on the same-revision
   validation workflow.
3. Confirm a documentation-only PR runs the full checks and a deliberately failing
   validation cannot deploy.
4. Treat this as workflow MVP only; it does not certify the product's authentication
   controls or permit release while blocking security risks remain.

### Incremental Delivery

1. Setup + Foundational → verified paths, maintainer roles, and Sonar prerequisites.
2. US1 → consistent PR checks and deployment gating.
3. US2 → owned risks, tested fail-closed policy, and security release gate.
4. US3 → verified CODEOWNERS and recorded quality baseline.
5. Polish → run quickstart and reconcile all workflow/documentation behavior.

### Release Constraint

The workflow does not implement end-to-end authentication. Web simulated login,
Mobile token acquisition, and server-side authorization remain open until separately
verified. The Mobile session context and protected navigation are existing local
controls and must not be represented as missing or as proof of server-side enforcement.
Production release remains blocked by unresolved critical/high risks unless an
exception permitted by the constitution is approved and recorded.

## Notes

- Every task uses the required unchecked checkbox, sequential task ID, applicable
  parallel/story labels, and an exact repository path or repository setting.
- [P] tasks must not edit the same file concurrently.
- TDD applies to executable risk-policy behavior; T012 must fail before T014 is
  implemented.
- API contract ownership, generated mock exports, and Mobile session implementation
  are completed by the separate architecture refactor and are not reimplemented here.
