# Data Model: Separação de acessos por perfil Web e Mobile

This feature adds no new account type. It uses the account's existing role and
contractor domain data to select separate Web and Mobile experiences.

## Authenticated Account

- **Purpose**: Represents the account whose successful authentication determines the
  active role-specific experience on either platform.
- **Fields used**:
  - `id`: account identifier.
  - `email`: account email.
  - `role`: required role, either `Freelancer` or `Contratante`.
  - `name`, `avatarUrl`, and role-specific profile data: presentation values used by
    existing account screens.
- **Relationship**: Has exactly one `Profile Role` for the lifetime of the account,
  consistent with the clarification in the feature spec.
- **Validation / invariant**: A successful authenticated state must resolve one
  supported role. An access-entry choice does not override the role returned for the
  authenticated account.

## Profile Role

- **Values**: `Freelancer` or `Contratante`.
- **Purpose**: Selects the permitted navigation and experience on Web and Mobile.
- **Web destinations**:
  - `Freelancer`: `/map`, `/active-gig`, `/earnings`, `/profile`, `/settings`.
  - `Contratante`: `/contractor/gigs`, `/contractor/create`,
    `/contractor/reports`, `/contractor/chat`.
- **Mobile destinations**:
  - `Freelancer`: map, earnings and profile navigation.
  - `Contratante`: gigs, gig creation, reports and chat navigation.
- **Validation / invariant**: A platform displays only destinations matching the
  authenticated role. This client navigation rule is not server-side authorization.

## Web Session

- **Purpose**: The current Web authentication state owned by the existing
  `AuthContext`.
- **Storage**: Existing `localStorage` key `trampo_taxa_auth_user`.
- **Lifecycle**: Public access -> authenticated account and role-specific home ->
  logout -> public access. A new login starts from the newly authenticated account's
  role and does not inherit another account's destination.
- **Validation / invariant**: A preserved destination may be restored only if it
  matches the current account role.

## Mobile Session

- **Purpose**: The current Mobile JWT session and the authenticated account role
  required to select a navigation tree.
- **Existing state**: Session restoration status and JWT are modeled in the Mobile
  auth context; role/user details are available in the shared authentication response
  and current-user data model but are not currently retained in `AuthState`.
- **Lifecycle**:
  - App launch -> restoring session; show no role-protected screens.
  - No valid token -> unauthenticated access entries.
  - Valid token -> resolve authenticated account and role, then mount the matching
    role navigation.
  - Sign-out or account change -> remove previous role navigation and persisted
    session before showing the next access entry.
- **Validation / invariant**: A JWT without a resolved supported role is not enough
  to mount either role's protected navigation. Role resolution failure stays in a
  non-protected access/error state and is surfaced to the person.
- **Storage**: JWT remains in existing platform-secure storage. Persist additional
  role data only if the authoritative authentication/session contract requires it;
  do not treat locally chosen role as authoritative identity.

## Contractor Domain Data

- **Contractor Gig**: Existing contractor vacancy and creation input data represented
  by shared `Gig` and `CreateGigInput` models. Contractors list and create gigs on
  Mobile, matching the functional scope in the spec.
- **Contractor Report**: Existing reporting data represented by the shared contractor
  KPI/report models.
- **Contractor Conversation**: Existing chat messages and sender-role model for
  operational gig chat.
- **Relationships**: Contractor navigation exposes these data only within the
  authenticated contractor experience. API access remains subject to server
  authorization independently of UI routing.
