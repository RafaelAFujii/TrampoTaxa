# Research: Separação de acessos por perfil Web e Mobile

## Decision 1: Use explicit access entries for each role on both platforms

- **Decision**: Provide distinct freelancer and contractor access entries on Web and
  Mobile. Retain a neutral Web entry as a chooser and use platform-appropriate
  navigation in Mobile; share validation and role semantics without duplicating
  authentication logic.
- **Rationale**: The requirement covers both applications, while the current Web
  `LoginScreen` combines roles and Mobile exposes only a freelancer session gate and
  freelancer tabs.
- **Alternatives considered**:
  - Keep one login screen per platform with an unrestricted role toggle: does not meet
    the separate access requirement.
  - Duplicate the complete authentication logic for each role: increases divergence
    and can produce inconsistent session handling.

## Decision 2: The authenticated account role is authoritative for navigation

- **Decision**: After login, select the landing screen from the authenticated user's
  role, and honor a saved destination only when that route belongs to the same role.
  Web routes and Mobile navigation trees must reject destinations belonging to the
  other role. Clear profile UI/navigation state on logout and do not restore a route
  from the previous account.
- **Rationale**: The spec establishes one profile per account. The Web router protects
  authentication but does not check role, and login can return to any saved path. The
  Mobile app currently mounts freelancer tabs for any authenticated JWT and has no
  role in its session state.
- **Alternatives considered**:
  - Trust the selected login entry to determine the authenticated role: conflicts with
    the one-profile-per-account rule.
  - Trust any saved Web path or Mobile navigation state after login: can reopen a
    screen belonging to the previous profile.

## Decision 3: Preserve platform authentication and resolve role from account data

- **Decision**: Keep Web authentication mock behavior unchanged. Mobile continues to
  use its JWT session and obtains the account role from authenticated user data; the
  shared authentication response and current-user model already expose `User.role`.
  During token restoration, resolve the current account role before rendering
  role-specific navigation. Client navigation remains a user-experience boundary, not
  server authorization.
- **Rationale**: The Web app has a local mock `AuthContext`; Mobile stores a JWT but
  its current `AuthState` contains no user/profile. Shared API models already define
  `Freelancer` and `Contratante`, and shared authentication contracts return user data.
- **Alternatives considered**:
  - Infer role from which tab opened login: can conflict with the authenticated
    account's actual role.
  - Treat possession of a JWT alone as sufficient to choose freelancer tabs:
    reproduces the current assumption and cannot support contractor navigation safely.

## Decision 4: Add existing Web contractor capabilities to Mobile

- **Decision**: Add Mobile contractor access and platform-native navigation for
  contractor gigs, gig creation, reports and chat, matching the existing Web
  contractor capabilities. Reuse existing shared API models/endpoints where their
  contracts fit; keep user-interface code platform-specific.
- **Rationale**: The user expanded the feature to Web and Mobile and selected the four
  existing contractor capabilities for Mobile. Shared package code already provides
  contractor models and generated API operations; Mobile currently has only freelancer
  map, earnings and profile tabs.
- **Alternatives considered**:
  - Add only a contractor placeholder/home screen: leaves the requested contractor
    experience incomplete on Mobile.
  - Rebuild contractor API models inside Mobile: duplicates existing shared contracts.

## Decision 5: Keep profile navigation and presentation platform-specific

- **Decision**: Use the existing Web routes and Mobile React Navigation architecture,
  with each platform presenting only the authenticated role's destinations. Share
  role/domain contracts where available, but do not share platform-specific screens.
- **Rationale**: This follows the project's Web/Mobile architecture boundary while
  preserving consistent role and session semantics.
- **Alternatives considered**:
  - Move screen implementation into a cross-platform shared package: conflicts with
    the platform architecture and would duplicate UI abstractions.
  - Share only role labels but leave navigation unconstrained: does not prevent stale
    profile screens after account changes.
