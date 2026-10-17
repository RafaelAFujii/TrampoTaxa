---

description: "Implementation task list for critical architecture refactoring"

---

# Tasks: Refatoração Crítica da Arquitetura

**Input**: Design documents from
`/specs/002-refatoracao-critica-arquitetura/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/client-architecture.md`, `quickstart.md`

**Organization**: Tasks are grouped by user story. All four stories have priority
P1. The shared API ownership story is scheduled first because tag validation and
generation depend on the contract and Orval configuration having one canonical
location.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: The task can run in parallel with other marked tasks because it changes
  separate files and has no dependency on incomplete work.
- **[Story]**: User story identifier from `spec.md`.
- Every task names the exact file(s) to change or validate.
- Tests are included because the project constitution mandates test-first development.

## Phase 1: Setup

**Purpose**: No repository-wide scaffolding is required; existing Bun workspaces,
Vitest, Orval, and Expo projects are reused. Story-specific setup stays in its story
phase.

## Phase 2: Foundational

**Purpose**: No additional shared blocker is needed before story work; all shared
contract, fixture, and Mobile foundations are assigned to the story that owns them.

---

## Phase 3: User Story 3 - Share the API Contract Across Applications (Priority: P1)

**Goal**: Make `packages/shared` the single owner and execution point for the OpenAPI
contract and generated client.

**Independent Test**: Run `bun run api:generate` from the repository root and verify
that generation reads only `packages/shared/openapi.yaml` and
`packages/shared/orval.config.ts`, then produces usable output under
`packages/shared/src/api/`.

### Tests for User Story 3

- [X] T001 [P] [US3] Add a Vitest ownership and generation-path regression test in `packages/shared/src/api/api-generation.test.ts` that fails unless the shared contract, config, and output paths are used

### Implementation for User Story 3

- [X] T002 [US3] Move `apps/web/docs/openapi.yaml` to `packages/shared/openapi.yaml` and `apps/web/orval.config.ts` to `packages/shared/orval.config.ts`, updating input and output paths there
- [X] T003 [US3] Add the shared `api:generate` command and required Orval, `yaml`, and Prettier development dependencies in `packages/shared/package.json` and update `bun.lock`
- [X] T004 [US3] Update the root `api:generate` command in `package.json` to delegate to `@trampotaxa/shared` and remove the Web-owned generator command from `apps/web/package.json`
- [X] T005 [P] [US3] Update API ownership, generation commands, and paths in `packages/shared/README.md` and `apps/web/README.md`
- [X] T006 [US3] Run `bun run api:generate` and verify the generated endpoint and model outputs are beneath `packages/shared/src/api/` with no reads from `apps/web/` contract/config paths

**Checkpoint**: Shared can generate the client without Web-owned API source files.

---

## Phase 4: User Story 1 - Generate Client Artifacts with Safe Names (Priority: P1)

**Goal**: Ensure every tag used to group generated endpoints is ASCII kebab-case,
reject invalid names before generation, and preserve HTTP routes and `operationId`s.

**Independent Test**: Verify declared and referenced tags against
`^[a-z0-9]+(-[a-z0-9]+)*$`, confirm invalid tags fail generation, then confirm
regeneration produces ASCII-only endpoint directories without changing HTTP paths or
`operationId` values.

**Dependency**: T002-T006 establish the shared contract/configuration location.

### Tests for User Story 1

- [X] T007 [P] [US1] Add Vitest cases for valid and invalid ASCII kebab-case tags, tag references, and the non-zero invalid-contract result in `packages/shared/scripts/validate-openapi-tags.test.ts`

### Implementation for User Story 1

- [X] T008 [US1] Implement OpenAPI tag parsing and validation with actionable failures in `packages/shared/scripts/validate-openapi-tags.ts`, enforcing `^[a-z0-9]+(-[a-z0-9]+)*$`
- [X] T009 [US1] Add the validation step before Orval in the `api:generate` script in `packages/shared/package.json`
- [X] T010 [P] [US1] Rename all declared OpenAPI tags and matching operation tag references in `packages/shared/openapi.yaml` to lowercase ASCII kebab-case, preserving paths, schemas, and `operationId` values
- [X] T011 [US1] Regenerate `packages/shared/src/api/endpoints/` and verify that old accented generated directories are removed and the OpenAPI contract remains semantically unchanged outside tag labels
- [X] T012 [US1] Run `packages/shared/scripts/validate-openapi-tags.test.ts` and `bun run api:generate`; confirm `packages/shared/openapi.yaml` passes validation and every generated directory under `packages/shared/src/api/endpoints/` is ASCII kebab-case

**Checkpoint**: API generation rejects unsafe group names and produces safe endpoint
paths from the shared contract.

---

## Phase 5: User Story 2 - Keep Mock Data Out of Production Bundles (Priority: P1)

**Goal**: Keep fixtures usable for tests and explicit development fallbacks while
excluding them from the package root and production Web/Mobile bundles.

**Independent Test**: Verify fixture access through `@trampotaxa/shared/mocks`, verify
the root entry does not expose fixtures, build Web and Mobile for production, and
inspect both bundles for fixture-only identifiers.

**Dependency**: T003 establishes the shared package metadata; coordinate package export
changes with the shared API package configuration from US3.

### Tests for User Story 2

- [X] T013 [P] [US2] Add package-entry regression tests proving fixture exports are absent from `packages/shared/src/index.ts` and available through `packages/shared/src/mocks.ts` in `packages/shared/src/mocks.test.ts`
- [X] T014 [P] [US2] Add a production bundle check for fixture-only identifiers in `apps/web/scripts/check-production-mocks.test.ts`

### Implementation for User Story 2

- [X] T015 [US2] Add the dedicated fixture export entry in `packages/shared/src/mocks.ts` and package subpath export in `packages/shared/package.json`
- [X] T016 [US2] Remove `mockGigs` and `mockContractorData` re-exports from `packages/shared/src/index.ts` while preserving domain types, utilities, and API exports
- [X] T017 [P] [US2] Change development-only fixture fallback imports in `apps/web/src/hooks/useGigsQuery.ts`, `apps/web/src/screens/ActiveGigScreen.tsx`, and `apps/web/src/screens/MapDashboardScreen.tsx` to use the explicit mock entry and ensure production code does not load those fixtures
- [X] T018 [P] [US2] Change the fixture fallback in `apps/mobile/src/screens/MapScreen.tsx` to use the explicit mock entry only in the `__DEV__` path, without adding fixture imports to shared production-facing exports
- [X] T019 [US2] Build Web with `npm --prefix apps/web run build` and export Mobile with `npx expo export --platform android --output-dir dist` from `apps/mobile/`; inspect `apps/web/dist/` and `apps/mobile/dist/` for fixture-only data
- [X] T020 [US2] Run `packages/shared/src/mocks.test.ts`, `apps/web/scripts/check-production-mocks.test.ts`, and `npm --prefix apps/mobile run typecheck` against `apps/mobile/tsconfig.json`

**Checkpoint**: Mock fixtures remain available to tests and development but are
unreachable from the shared root entry and absent from both production bundles.

---

## Phase 6: User Story 4 - Provide Mobile Navigation and JWT Session State (Priority: P1)

**Goal**: Add a native navigation boundary and an explicit JWT session lifecycle that
uses protected storage and adds bearer credentials only to private requests.

**Independent Test**: Exercise session restoration, missing credentials, successful
authentication, sign-out, secure-storage failures, and unauthorized responses. Verify
navigation visibility and bearer headers for both private and public operations.

**Dependency**: Shared generated API ownership from T002-T006; Mobile's session,
navigation, and storage remain platform-specific.

### Tests for User Story 4

- [X] T021 [P] [US4] Add Vitest tests for `restoring`, `unauthenticated`, `authenticated`, sign-out, unauthorized-response, and SecureStore failure transitions in `apps/mobile/src/context/AuthContext.test.tsx`
- [X] T022 [P] [US4] Add tests proving bearer headers are attached only to private operations and tokens are cleared after unauthorized responses in `apps/mobile/src/api/authenticatedFetch.test.ts`
- [X] T023 [P] [US4] Add navigator tests proving protected tabs are hidden during restoration and unauthenticated states in `apps/mobile/navigation/RootNavigator.test.tsx`

### Implementation for User Story 4

- [X] T024 [US4] Add Expo SDK-compatible `expo-secure-store` and Vitest development dependencies in `apps/mobile/package.json` and update the workspace lockfile `bun.lock`
- [X] T025 [US4] Implement typed Mobile session state, SecureStore restore/persist/clear operations, and explicit storage-error handling in `apps/mobile/src/context/AuthContext.tsx`
- [X] T026 [US4] Implement the Mobile API request boundary that adds bearer credentials only to private operations and invalidates the session on unauthorized responses in `apps/mobile/src/api/authenticatedFetch.ts`
- [X] T027 [US4] Extract the current tab navigator from `apps/mobile/App.tsx` into `apps/mobile/navigation/RootNavigator.tsx` and define typed route parameters in `apps/mobile/navigation/types.ts`
- [X] T028 [US4] Integrate the auth provider and root navigator in `apps/mobile/App.tsx`, ensuring the restoration state does not render protected tabs
- [X] T029 [US4] Run `apps/mobile/src/context/AuthContext.test.tsx`, `apps/mobile/src/api/authenticatedFetch.test.ts`, `apps/mobile/navigation/RootNavigator.test.tsx`, and `npm --prefix apps/mobile run typecheck`; verify SecureStore failures never create an authenticated state and no token is logged

**Checkpoint**: Mobile restores JWT state securely, gates its native tabs, and adds
credentials only for private API calls.

---

## Phase 7: Polish & Cross-Cutting Validation

**Purpose**: Validate all stories together and update documentation to reflect final
ownership and runtime behavior.

- [X] T030 Update mock import and development fallback guidance in `packages/shared/README.md`, `apps/web/README.md`, and `apps/mobile/README.md`
- [X] T031 Run `npm --prefix packages/shared test`, `npm --prefix apps/web run build`, `npm --prefix apps/mobile run typecheck`, `bun run api:generate`, and the Mobile production export; record results against `specs/002-refatoracao-critica-arquitetura/quickstart.md`
- [X] T032 Verify the acceptance criteria in `specs/002-refatoracao-critica-arquitetura/spec.md`, confirm both production bundles exclude mock fixtures, and confirm no HTTP path or `operationId` changed solely due to tag normalization

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No separate setup-only changes are needed.
- **Foundational (Phase 2)**: No extra blocking infrastructure is needed; story tasks
  establish only the foundations they own.
- **US3 (Phase 3)**: First because shared contract/config ownership is a prerequisite
  for safe tag validation and generation.
- **US1 (Phase 4)**: Depends on US3 and uses the canonical shared contract.
- **US2 (Phase 5)**: Depends on the shared package export metadata from US3; can run
  independently of US1 after that prerequisite.
- **US4 (Phase 6)**: Uses the generated shared client from US3; otherwise its native
  storage, session, and navigation tasks are isolated from US1 and US2.
- **Polish (Phase 7)**: Depends on the stories selected for delivery.

### User Story Dependencies

- **US1 (P1)**: Depends on US3 for the shared API contract, generator configuration,
  and command.
- **US2 (P1)**: Depends on US3 for the shared package manifest and explicit subpath
  exports. It does not depend on US1.
- **US3 (P1)**: No user-story dependencies; it is the foundation for the other API
  consumers.
- **US4 (P1)**: Depends on US3 for the generated client contract; no dependency on
  US1 or US2.

### Parallel Opportunities

- Within US3, the initial ownership test T001 can be written before the move; README
  updates T005 can run alongside generator wiring once paths are agreed.
- In US1, validator tests T007 can be written in parallel with US3 work; validator
  implementation and contract tag updates must wait for shared ownership.
- In US2, tests T013 and T014 are independent and can be authored in parallel. Web
  fixture imports T017 and Mobile fixture imports T018 affect separate files and can
  proceed in parallel after the mock subpath is defined.
- In US4, tests T021, T022, and T023 touch separate files and can be written in
  parallel. SecureStore provider T025, request adapter T026, and navigator extraction
  T027 touch separate files but must integrate through T028 after their contracts are
  agreed.
- US2 and US4 can be implemented in parallel after the shared package prerequisites
  from US3 are complete.

### Parallel Example: User Story 4

```text
Task: T021 Write session transition tests in apps/mobile/src/context/AuthContext.test.tsx
Task: T022 Write authorized-fetch tests in apps/mobile/src/api/authenticatedFetch.test.ts
Task: T023 Write navigation-state tests in apps/mobile/navigation/RootNavigator.test.tsx
```

### Parallel Example: User Story 3

```text
Task: T001 Write the shared generation ownership regression test in packages/shared/src/api/api-generation.test.ts
Task: T005 Update API ownership documentation in packages/shared/README.md and apps/web/README.md
```

### Parallel Example: User Story 1

```text
Task: T007 Write validator tests in packages/shared/scripts/validate-openapi-tags.test.ts
Task: T010 Normalize tag names and references in packages/shared/openapi.yaml
```

### Parallel Example: User Story 2

```text
Task: T013 Add explicit mock-entry tests in packages/shared/src/mocks.test.ts
Task: T014 Add production bundle checks in apps/web/scripts/check-production-mocks.test.ts
```

## Implementation Strategy

### MVP First

The smallest useful MVP is **US3 followed by US1**: establish shared API ownership,
then validate and regenerate filesystem-safe endpoint groups. This resolves generator
ownership and unsafe output paths without waiting for the independent Mobile work.

### Incremental Delivery

1. Complete US3 and validate generation from the shared package.
2. Complete US1 and validate all tags and generated endpoint paths.
3. Complete US2 and verify production bundles contain no mock fixture data.
4. Complete US4 and validate session security, request headers, and protected
   navigation.
5. Run the complete quickstart validation before release.

### Format Validation

- All tasks use `- [ ] Tnnn`, with sequential IDs.
- Every user-story task has the matching `[USn]` label.
- `[P]` appears only on tasks that can work independently on separate files.
- Every task includes an explicit repository file path.

## Notes

- Tests in each story precede the implementation they protect.
- Do not store JWT values in logs, ordinary app storage, or shared platform-independent
  code.
- Client navigation and request headers do not replace server-side authorization.
- The generated API's HTTP paths, request/response schemas, and operation IDs remain
  unchanged unless an independent API-contract change is approved.
