# Tasks: Refatoracao visual sem alterar fluxos

**Input**: Design documents from `/specs/012-visual-refactor-ui/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: This feature includes visual/accessibility validation tasks, but no new behavioral test suite is required because existing flows must remain unchanged.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the visual baseline and preservation checks.

- [X] T001 Inventory existing web and mobile visual patterns and primary screens in apps/web/src and apps/mobile/src
- [X] T002 [P] Record baseline routes and primary task steps from apps/web/src/routes/routes.tsx and apps/mobile/src/navigation
- [X] T003 [P] Create shared web visual tokens for the approved palette and typography in apps/web/src/index.css
- [X] T004 [P] Create shared mobile visual tokens and role-specific styles in apps/mobile/src/theme if absent, otherwise a new app-level theme file

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared presentation primitives that all user stories depend on.

**CRITICAL**: Complete these tasks before story-specific screen work.

- [X] T005 Refactor base web surfaces and global focus styles without changing markup behavior in apps/web/src/index.css
- [X] T006 [P] Refactor shared web buttons, text inputs and navigation controls in apps/web/src/components/ui and apps/web/src/components/navigation
- [X] T007 [P] Create or refactor consistent mobile status, action and surface primitives under apps/mobile/src/components
- [X] T008 [P] Preserve reduced-motion behavior and remove non-user-triggered visual animation in apps/web/src/index.css and relevant mobile components
- [X] T009 Re-check all existing routes and flow handlers before visual implementation to establish no-change guards

**Checkpoint**: Foundation ready; user story implementation can begin.

---

## Phase 3: User Story 1 - Navegacao visual com identidade propria (Priority: P1) 🎯 MVP

**Goal**: Give the existing web and mobile flows a grounded, distinctive presentation while preserving every action and outcome.

**Independent Test**: Run the main login, map, offer, earnings/profile and contractor flows and verify the before/after task steps and outcomes are unchanged.

- [X] T010 [P] [US1] Refactor the web application shell and primary navigation using the approved palette and typography in apps/web/src/layouts/AppLayout.tsx
- [X] T011 [P] [US1] Refactor the web bottom navigation and action hierarchy in apps/web/src/components/navigation/BottomNavigation.tsx
- [X] T012 [P] [US1] Refactor freelancer primary screens for consistent hierarchy in apps/web/src/screens/MapDashboardScreen.tsx, apps/web/src/screens/ActiveGigScreen.tsx and apps/web/src/screens/EarningsScreen.tsx
- [X] T013 [P] [US1] Refactor contractor primary screens and modals in apps/web/src/screens/contractor
- [X] T014 [P] [US1] Refactor login and registration presentation without changing fields or handlers in apps/web/src/screens/LoginScreen.tsx and apps/web/src/screens/CadastroScreen.tsx
- [X] T015 [P] [US1] Refactor mobile primary navigation and shared status surfaces in apps/mobile/src/navigation and apps/mobile/src/components
- [X] T016 [P] [US1] Refactor mobile freelancer screens in apps/mobile/src/screens/MapScreen.tsx, apps/mobile/src/screens/ActiveShiftScreen.tsx and apps/mobile/src/screens/EarningsScreen.tsx
- [X] T017 [P] [US1] Refactor mobile contractor screens in apps/mobile/src/screens/ContractorGigsScreen.tsx, apps/mobile/src/screens/ContractorChatScreen.tsx and apps/mobile/src/screens/ContractorReportsScreen.tsx
- [X] T018 [US1] Review web/mobile changes against the UI contract and remove decorative elements that do not communicate hierarchy or state in specs/012-visual-refactor-ui/contracts/ui-contract.md

**Checkpoint**: User Story 1 is independently testable and delivers the distinctive visual treatment without flow changes.

---

## Phase 4: User Story 2 - Uso responsivo e acessivel (Priority: P2)

**Goal**: Preserve readability, keyboard/touch access and responsive reachability across supported layouts.

**Independent Test**: Review narrow and wide web layouts and mobile emulator sizes; verify focus visibility, contrast and access to every primary control.

- [X] T019 [P] [US2] Apply narrow and wide web layout rules to apps/web/src/screens and apps/web/src/layouts without changing routes or step order
- [X] T020 [P] [US2] Improve visible keyboard focus and contrast for web interactive primitives in apps/web/src/components/ui and apps/web/src/components/navigation
- [X] T021 [P] [US2] Apply safe-area, wrap and minimum-touch-target rules to mobile screens and modals under apps/mobile/src/screens and apps/mobile/src/components
- [X] T022 [P] [US2] Review long text, empty, loading and error states for wrapping and recovery clarity across apps/web/src/screens and apps/mobile/src/screens
- [X] T023 [US2] Validate reduced-motion behavior and remove motion from non-user-triggered states in apps/web/src/index.css and mobile components

**Checkpoint**: User Stories 1 and 2 work independently and remain responsive and accessible.

---

## Phase 5: User Story 3 - Continuidade visual entre telas (Priority: P3)

**Goal**: Create a consistent visual language across adjacent screens without making every context look identical.

**Independent Test**: Compare adjacent freelancer and contractor screens and confirm shared hierarchy, states and spacing while each task remains recognizable.

- [X] T024 [P] [US3] Normalize web heading, body, button and status treatments across apps/web/src/screens and apps/web/src/components
- [X] T025 [P] [US3] Normalize mobile heading, body, button and status treatments across apps/mobile/src/screens and apps/mobile/src/components
- [X] T026 [P] [US3] Align web success, error, loading and empty states in apps/web/src/screens and apps/web/src/components
- [X] T027 [P] [US3] Align mobile success, error, loading and empty states in apps/mobile/src/screens and apps/mobile/src/components
- [X] T028 [US3] Remove remaining neon, gradient and generic card patterns from representative screens in apps/web/src and apps/mobile/src
- [X] T029 [US3] Compare adjacent screens and remove one unnecessary flourish per area after visual critique

**Checkpoint**: All three user stories are independently functional and share one deliberate presentation system.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and concise cleanup.

- [X] T030 [P] Run web build and lint using bun run build:web and bun run lint
- [X] T031 [P] Run web tests using bun run --filter web test
- [X] T032 [P] Run mobile typecheck and tests using bun run --filter mobile typecheck and bun run --filter mobile test
- [ ] T033 [P] Perform responsive visual review for representative web and mobile screens
- [X] T034 Verify representative flows against specs/012-visual-refactor-ui/quickstart.md
- [X] T035 Inspect final diff for accidental route, hook, store, API or copy changes
- [X] T036 Update feature documentation only where implementation decisions materially affect specs/012-visual-refactor-ui/plan.md or quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 and blocks every user story.
- **User Stories (Phase 3+)**: Depend on Phase 2; they may proceed by priority P1, P2, P3.
- **Polish (Final Phase)**: Depends on all desired user stories.

### User Story Dependencies

- **User Story 1**: Can begin after Foundational; no dependency on US2 or US3.
- **User Story 2**: Can begin after Foundational; should integrate with US1 primitives but remain testable independently.
- **User Story 3**: Can begin after Foundational; should reuse US1/US2 primitives and remain testable independently.

### Within Each User Story

- Shared primitives before story screens.
- Web and mobile changes may run in parallel.
- A story is complete only after no-change and visual checks pass.

## Parallel Example: User Story 1

```text
T009 Web shell
T011 Web freelancer screens
T012 Web contractor screens
T015 Mobile freelancer screens
T016 Mobile contractor screens
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Verify main web/mobile tasks and flow continuity.
5. Stop for validation before P2/P3 if a visual direction change is needed.

### Incremental Delivery

1. Setup + Foundational.
2. Add User Story 1 and validate the main identity.
3. Add User Story 2 and validate responsiveness/accessibility.
4. Add User Story 3 and validate cross-screen continuity.

## Notes

- Validation: web build, lint, mobile typecheck and web/mobile tests excluding production-mock isolation passed. Full web tests: 32/33 passed; the isolation test finds existing fixture text from `packages/shared/src/data/mockContractorData.ts` in the bundle. Full mobile tests: 21/22 passed; the isolation test finds the existing `cgig-101` fixture marker. Long-text/error/empty-state review and the read-only representative web flow walkthrough are complete. Native mobile visual review remains unverified because no Android emulator/ADB or `react-native-web` is available.

- [P] tasks = different files and no dependency on incomplete tasks.
- [US1], [US2] and [US3] map tasks to spec stories.
- Preserve routes, handlers, hooks, stores, tRPC calls and business copy.
