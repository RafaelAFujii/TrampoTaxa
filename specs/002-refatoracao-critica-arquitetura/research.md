# Research: Refatoração Crítica da Arquitetura

## API contract naming and generation

- **Decision**: Keep the accepted naming scope limited to OpenAPI tags used for
  generated endpoint grouping. Require each tag to match
  `^[a-z0-9]+(-[a-z0-9]+)*$`, and run a validation step before Orval.
- **Rationale**: The current OpenAPI tags contain Portuguese accents, ampersands, and
  spaces. Existing `tags-split` output has corresponding accented directory names under
  `packages/shared/src/api/endpoints`. This is direct evidence that tags determine
  unsafe generated paths in the current configuration. The accepted clarification
  explicitly excludes `operationId` and HTTP paths from this normalization.
- **Alternatives considered**: Rename only the generated directories after generation;
  change `operationId` and HTTP paths as well. Post-processing does not fix the
  contract's source of invalid names, while changing paths or operation identifiers
  expands scope and risks changing API semantics.
- **Validation source**: `apps/web/docs/openapi.yaml`, `apps/web/orval.config.ts`, and
  existing `packages/shared/src/api/endpoints/` output.

## Shared API ownership

- **Decision**: Relocate the OpenAPI document and Orval configuration to the root of
  `packages/shared`; expose generation as a shared-package script and make the root
  command delegate there. Keep generated client output beneath `packages/shared/src/api`.
- **Rationale**: The generated files already live in `packages/shared`, but their
  source contract, configuration, and current generation script are owned by Web.
  Moving ownership removes the application boundary mismatch without changing the
  shared client's consumers.
- **Alternatives considered**: Keep generation in Web and point at shared outputs, or
  duplicate the contract for Mobile. Both preserve or create competing ownership.
- **Validation source**: Root and Web package scripts, current Orval configuration,
  shared package manifest, and shared API output layout.

## Mock fixture isolation

- **Decision**: Remove mock datasets from the shared package root exports, expose them
  through a dedicated explicit mock import path for tests and development, and update
  application mock consumers to load them only in development code paths. Keep domain
  types and non-fixture utilities available through the package root.
- **Rationale**: Web and Mobile currently import `mockGigs` from
  `@trampotaxa/shared`; that root export creates a transitive production dependency
  regardless of the package's intended API use. Tests already import fixtures directly
  from their data module. Production builds must verify the absence of fixture payloads,
  not just the absence of root exports.
- **Alternatives considered**: Remove all fixture data, which breaks current demo and
  development fallbacks; leave imports unchanged and rely only on tree shaking, which
  does not establish the required bundle exclusion.
- **Validation source**: Root shared exports and Web/Mobile imports of `mockGigs`.

## Mobile navigation and authentication session

- **Decision**: Move native navigation composition out of `apps/mobile/App.tsx` into an
  `apps/mobile/navigation/` boundary. Add an explicit asynchronous session state
  (`restoring`, `unauthenticated`, `authenticated`) and store any persisted JWT with
  Expo SecureStore; clear local credentials and protected navigation after sign-out or
  an API unauthorized response.
- **Rationale**: Existing Mobile already uses React Navigation and React Query, and its
  tab navigator is currently composed in `App.tsx`. Expo SecureStore provides encrypted
  device storage on Android and Keychain-backed storage on iOS, matching the
  platform-protected credential requirement. SecureStore access remains mobile-specific.
- **Alternatives considered**: Store JWT in AsyncStorage or other ordinary app storage,
  which does not satisfy the security requirement; put platform-specific persistence in
  `packages/shared`, which would violate the platform boundary.
- **API request boundary**: Centralize adding bearer credentials for private generated
  endpoint calls in a Mobile API adapter or transport boundary. Do not make shared
  platform-independent code import Expo SecureStore. Ensure public endpoints do not
  receive credentials.
- **Failure handling**: Treat SecureStore read/write failures as explicit session
  failures; do not report a restored authenticated state if the credential could not be
  read. An unauthorized response invalidates the stored and in-memory token.
- **Validation source**: `apps/mobile/App.tsx`, `apps/mobile/package.json`, current
  generated methods accepting `RequestInit`, and
  [Expo SecureStore documentation](https://docs.expo.dev/versions/latest/sdk/securestore/).

## Test and quality approach

- **Decision**: Add focused unit/contract tests for tag validation, root-vs-mock package
  imports, Mobile session transitions, and bearer header behavior. Run the existing
  shared Vitest suite, Web build, Mobile type check, and inspect production bundles for
  fixture-only identifiers.
- **Rationale**: These checks directly exercise the feature's acceptance criteria and
  use the repository's existing test/build tools.
- **Alternatives considered**: Rely on visual checks or successful Orval generation
  alone; those do not detect transitive mock imports or token leakage.
