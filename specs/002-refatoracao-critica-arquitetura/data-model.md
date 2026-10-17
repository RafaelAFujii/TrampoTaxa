# Data Model: Refatoração Crítica da Arquitetura

This feature changes package boundaries and client-side state. It does not introduce
server-side entities or change the REST resource model.

## OpenAPI Tag

- **Purpose**: Names the generated endpoint group associated with an API operation.
- **Fields**:
  - `name`: required unique string, matching `^[a-z0-9]+(-[a-z0-9]+)*$`.
  - `description`: optional human-readable summary; not used for generated path names.
- **Relationships**: An operation may reference one or more declared tags. A tag is a
  grouping label, not an HTTP route or an operation identifier.
- **Validation**: Every declared tag and every tag referenced by an operation must
  satisfy the name rule before generation. References must resolve to a declared tag.

## Mock Fixture Dataset

- **Purpose**: Provides sample gig and contractor data for tests and explicitly enabled
  development fallbacks.
- **Sources**: `mockGigs.ts` and `mockContractorData.ts`.
- **Relationships**: Fixtures may use shared domain types, but the shared package root
  must not re-export the fixture modules. Tests and development-only consumers use the
  explicit mock entry point.
- **Lifecycle**: Available to unit tests and development paths; absent from Web and
  Mobile production bundles.

## Mobile Authentication Session

- **Purpose**: Represents the Mobile app's local knowledge of a user's JWT session.
- **Fields**:
  - `status`: one of `restoring`, `unauthenticated`, or `authenticated`.
  - `accessToken`: present only while authenticated; treated as a secret and not exposed
    to UI or logs.
  - `user`: optional authenticated principal/profile needed by protected routing.
- **Transitions**:
  - App launch -> `restoring`.
  - No stored token or failed restoration -> `unauthenticated`.
  - Successful authentication -> persist token, then `authenticated`.
  - Sign-out, token rejection, or failed credential restoration -> remove persisted
    token and enter `unauthenticated`.
- **Invariants**:
  - Authenticated state requires a non-empty access token.
  - Only protected API requests receive a bearer token.
  - Client session state gates navigation but never replaces server authorization.
  - Any persisted token is stored using platform-protected credential storage.
