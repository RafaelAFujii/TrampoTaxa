# Tasks: Separação de acessos por perfil Web e Mobile

**Input**: Design documents from `/specs/004-separar-acessos-perfis/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/access-navigation.md, quickstart.md

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel when different files are touched and no task dependency remains open.
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`).
- Include exact file paths in descriptions.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the auth/session and route surfaces that drive both apps before story implementation.

- [x] T001 Confirm shared auth-role assumptions in `packages/shared/src/api/model/user.ts`, `packages/shared/src/api/model/authResponse.ts`, `apps/web/src/context/AuthContext.tsx`, and `apps/mobile/src/context/session.ts`
- [x] T002 [P] Add failing role-switch tests for Web and Mobile in `apps/web/src/context/auth_flow.test.ts` and `apps/mobile/navigation/RootNavigator.test.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared guard rails to enforce the authenticated role before user-facing routes or tabs are mounted.

- [x] T003 Implement the role-aware guard logic in `apps/web/src/routes/ProtectedRoute.tsx` and `apps/mobile/navigation/authNavigation.ts` so mismatched routes remain blocked until the correct role is confirmed
- [x] T004 [P] Update the session restoration flow in `apps/mobile/src/context/AuthContext.tsx` and `apps/mobile/src/context/session.ts` to resolve role before rendering protected navigation
- [x] T005 [P] Update the default route mapping and navigation state in `apps/web/src/routes/routes.tsx` and `apps/mobile/navigation/types.ts` to separate freelancer and contractor destinations
- [x] T006 Ensure logout or account switch clears prior role-specific state in `apps/web/src/context/AuthContext.tsx` and `apps/mobile/src/context/AuthContext.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin independently.

---

## Phase 3: User Story 1 - Entrar com o perfil correto após trocar de conta (Priority: P1) 🎯 MVP

**Goal**: After a freelancer signs out and a contractor signs in, the app must show only the contractor experience and never restore the previous freelancer map state.

**Independent Test**: Simulate a freelancer session, sign out, sign in as a contractor, and verify the contractor home is shown without any freelancer-only content or stale map state.

### Tests for User Story 1

- [x] T010 [P] [US1] Add failing Web route-switch regression in `apps/web/src/context/auth_flow.test.ts` to cover freelancer -> contractor and contractor -> freelancer transitions
- [x] T011 [P] [US1] Add failing Mobile session restoration regression in `apps/mobile/navigation/RootNavigator.test.tsx` to cover stale route restoration and role mismatch

### Implementation for User Story 1

- [x] T012 [US1] Update `apps/web/src/context/AuthContext.tsx` to clear stale session context and preserve only the authenticated account role after login/logout
- [x] T013 [US1] Update `apps/web/src/routes/routes.tsx` and `apps/web/src/routes/ProtectedRoute.tsx` to redirect to the correct role landing page and block the other role's protected routes
- [x] T014 [US1] Update `apps/mobile/src/context/AuthContext.tsx` and `apps/mobile/navigation/RootNavigator.tsx` so a restored session resolves the active role before mounting freelancer or contractor navigation
- [x] T015 [US1] Add stale-state cleanup in `apps/mobile/navigation/authNavigation.ts` so returning from the app or reloading does not restore a mismatched role-specific screen

**Checkpoint**: At this point, User Story 1 should be fully functional and independently testable.

---

## Phase 4: User Story 2 - Acessar a tela do próprio perfil e jornada mobile do contratante (Priority: P2)

**Goal**: Expose clear entry points and role-specific journeys on Web and Mobile so a contractor sees contractor screens and a freelancer sees freelancer screens without cross-role leakage.

**Independent Test**: Open the freelancer and contractor access flows on Web and Mobile and verify each role lands only on its own screens, including the contractor Mobile journey for gigs, creation, reports and chat.

### Tests for User Story 2

- [x] T020 [P] [US2] Add failing Web access-entry test in `apps/web/src/context/auth_flow.test.ts` or `apps/web/src/routes/role-navigation.test.ts` to validate explicit contractor/freelancer entry behavior
- [x] T021 [P] [US2] Add failing Mobile contractor navigation test in `apps/mobile/navigation/RootNavigator.test.tsx` to validate role-specific tab and screen access for contractor journeys

### Implementation for User Story 2

- [x] T022 [P] [US2] Update `apps/web/src/screens/LoginScreen.tsx` to present distinct access surfaces for freelancer and contractor and keep the selected access flow singular and explicit
- [x] T023 [US2] Update `apps/mobile/navigation/RootNavigator.tsx` and `apps/mobile/navigation/types.ts` so Mobile mounts separate freelancer and contractor navigation trees and does not assume every authenticated session is freelancer
- [x] T024 [US2] Add the contractor-specific Mobile screens and wiring in `apps/mobile/src/screens/ContractorGigsScreen.tsx`, `apps/mobile/src/screens/CreateGigScreen.tsx`, `apps/mobile/src/screens/ContractorReportsScreen.tsx`, and `apps/mobile/src/screens/ContractorChatScreen.tsx`
- [x] T025 [US2] Validate authentication and role failure states in `apps/web/src/screens/LoginScreen.tsx`, `apps/web/src/routes/ProtectedRoute.tsx`, and `apps/mobile/navigation/RootNavigator.tsx` so failed or unresolved role detection keeps the app on access screens without protected content

**Checkpoint**: At this point, both user stories should work independently and keep role boundaries consistent across platforms.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation sync, and focused checks across both apps.

- [x] T030 [P] Refresh the acceptance validation in `specs/004-separar-acessos-perfis/quickstart.md` with Web and Mobile role-change checks and the contractor journey scope
- [x] T031 [P] Run the focused validation suite for Web (`npm --prefix apps/web test`, `npm --prefix apps/web run lint`, `npm --prefix apps/web run build`) and Mobile (`npm --prefix apps/mobile test`, `npm --prefix apps/mobile run typecheck`)
- [x] T032 Review and tidy any stale route assumptions in `apps/web/src/routes/routes.tsx`, `apps/web/src/routes/ProtectedRoute.tsx`, `apps/mobile/navigation/RootNavigator.tsx`, and `apps/mobile/navigation/authNavigation.ts` to keep role boundaries consistent and non-contradictory

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user-story work.
- **User Story 1 (Phase 3)**: Depends on Foundational completion and can run independently of User Story 2.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and can run independently of User Story 1.
- **Polish (Phase 5)**: Depends on both stories being complete and validated.

### User Story Dependencies

- **User Story 1 (US1)**: No dependency on other stories; the user story can be validated on its own.
- **User Story 2 (US2)**: No dependency on US1; it is independently testable once the Foundational phase is complete.

### Parallel Opportunities

- `T002` can run in parallel with `T001`.
- `T004`, `T005`, and `T006` can run in parallel once `T003` is complete.
- `T010` and `T011` can run in parallel within US1.
- `T020` and `T021` can run in parallel within US2.
- `T022` and `T024` can run in parallel when the route contract is stable.
- `T030` and `T031` can run in parallel in the final polish phase.

---

## Parallel Example: User Story 1

```bash
# Launch role-switch regression tests in parallel
Task: "Add failing Web route-switch regression in apps/web/src/context/auth_flow.test.ts"
Task: "Add failing Mobile session restoration regression in apps/mobile/navigation/RootNavigator.test.tsx"

# Launch the core implementation in parallel after the guard rails exist
Task: "Update apps/web/src/context/AuthContext.tsx to clear stale session context and preserve only the authenticated account role"
Task: "Update apps/mobile/src/context/AuthContext.tsx and apps/mobile/navigation/RootNavigator.tsx so a restored session resolves the active role before mounting protected navigation"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup + Foundational.
2. Implement User Story 1 and validate the role-switch stories independently.
3. Stop and confirm the current account never reopens the previous role's state.

### Incremental Delivery

1. Setup + Foundational -> route guard and session role resolution ready.
2. Add US1 -> validate Web and Mobile role switch flows.
3. Add US2 -> validate explicit entry surfaces and Mobile contractor access.
4. Final polish -> run targeted Web and Mobile validation commands and update docs.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once the foundation is stable:
   - Developer A: User Story 1, focused on Web/Mobile stale-session and role-switch behavior.
   - Developer B: User Story 2, focused on explicit access entry and Mobile contractor navigation.
3. Final polish runs after both stories are stable and independently validated.

---

## Notes

- [P] tasks are different files or independent work streams with no blocking dependency.
- [Story] label maps each task to a user story for traceability.
- Tasks are written to stay within the existing Web and Mobile file layout and the shared API contracts already present in the repo.
- Each story remains independently testable and intentionally avoids mixing unrelated product work into the implementation flow.
