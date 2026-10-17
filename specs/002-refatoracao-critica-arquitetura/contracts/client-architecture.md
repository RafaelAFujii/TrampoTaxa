# Client Architecture Contracts

## Shared OpenAPI generation contract

- **Source of truth**: `packages/shared/openapi.yaml`.
- **Generator configuration**: `packages/shared/orval.config.ts`.
- **Invocation**: shared package script `api:generate`; the repository-level
  `api:generate` command delegates to the shared package.
- **Generated output**: `packages/shared/src/api/endpoints/` and
  `packages/shared/src/api/model/`.
- **Group names**: every OpenAPI tag used to group generated endpoint files MUST match
  `^[a-z0-9]+(-[a-z0-9]+)*$`.
- **Compatibility**: do not change HTTP paths, request/response schemas, or
  `operationId` values solely to normalize generated filenames.
- **Failure**: tag validation or generation errors return a failing process status and
  must not be presented as a successful generation.

## Shared package import contract

- Standard domain types, platform-independent utilities, and generated API exports
  remain reachable from `@trampotaxa/shared`.
- Mock fixtures are reachable only from the explicit `@trampotaxa/shared/mocks` import
  path.
- Web and Mobile use that mock path only within development-only fallbacks; normal
  production application imports do not reference fixture modules.
- The shared package remains platform-independent and does not import React Native,
  Expo SecureStore, or app-specific auth context.

## Mobile session and private request contract

- The Mobile authentication provider exposes an explicit restoration/loading state,
  an unauthenticated state, and an authenticated state.
- A credential becomes available to protected request code only after successful
  restoration or authentication.
- The Mobile request boundary adds a bearer authorization header to operations declared
  private by the API contract; public operations do not receive that header.
- Sign-out and an API unauthorized response clear both in-memory and persisted token
  state and return navigation to its unauthenticated route group.
- Storage or restoration errors are reported and leave the application unauthenticated;
  failures must not silently produce a successful authenticated session.
- UI route protection is a client-side usability boundary only. The API remains
  responsible for authorization and role enforcement.

## Navigation contract

- `apps/mobile/navigation/` owns the native root navigator and route parameter types.
- The authenticated route group contains the existing tab destinations (map, earnings,
  profile).
- Unauthenticated and restoration states are handled before protected tabs are
  rendered; the restoration state must not briefly expose protected destinations.
- This feature establishes routing and session infrastructure, not a redesign of
  authentication screens or server-side login behavior.
