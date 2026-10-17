# Feature Specification: Refatoração Crítica da Arquitetura

**Feature Branch**: `002-refatoracao-critica-arquitetura` (branch não criada)

**Created**: 2026-10-16

**Status**: Complete

**Input**: User description: "Inicialize a especificação `002-refatoracao-critica-arquitetura` e defina-a como a feature ativa no repositório. O escopo desta spec é estritamente CÓDIGO E INFRAESTRUTURA DE DIRETÓRIOS, com o objetivo de resolver 4 dívidas técnicas urgentes na arquitetura do monorepo: padronizar nomes OpenAPI/Orval como kebab-case ASCII; impedir que mocks do pacote shared entrem nos bundles de produção; mover configuração e contrato OpenAPI da aplicação web para shared; e provisionar navegação nativa e estado de autenticação JWT no Mobile."

## Clarifications

### Session 2026-10-16

- Q: Quais nomes do contrato OpenAPI devem seguir kebab-case ASCII para garantir nomes seguros nos arquivos gerados? → A: Somente tags OpenAPI usadas para agrupar endpoints.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate Client Artifacts with Safe Names (Priority: P1)

As a maintainer, I need generated API artifacts to use predictable, filesystem-safe
names so that generation works consistently across supported development environments.

**Why this priority**: Unsafe names in the API contract can break generation and block
both applications from consuming the same service contract.

**Independent Test**: Validate every OpenAPI tag used to group generated endpoints
against the required ASCII kebab-case rule, then generate the client from the shared
contract without a naming error.

**Acceptance Scenarios**:

1. **Given** an OpenAPI tag used to group generated endpoints, **When** its name is
   checked, **Then** it contains only lowercase ASCII letters, digits, and single
   hyphens between non-empty segments.
2. **Given** a tag currently containing spaces or diacritics, **When** the contract is
   normalized, **Then** the corresponding generated group name uses its unaccented,
   lowercase kebab-case form, such as `autenticacao-usuarios`.
3. **Given** a contract that violates the naming rule, **When** client generation is
   validated, **Then** the violation is reported rather than silently producing unsafe
   artifact names.

---

### User Story 2 - Keep Mock Data Out of Production Bundles (Priority: P1)

As a maintainer, I need test and demonstration fixtures to be independent from the
shared package's normal public entry point so that production applications do not ship
large fake datasets.

**Why this priority**: Accidental mock exports increase production bundle size and can
expose misleading test data to application users.

**Independent Test**: Build the production Web and Mobile applications and verify that
neither the shared package root entry point nor either production bundle includes the
mock datasets.

**Acceptance Scenarios**:

1. **Given** an application importing ordinary shared types, utilities, or API
   functions, **When** it imports the package root, **Then** mock dataset modules are
   not loaded or re-exported.
2. **Given** a test or development consumer that intentionally needs fixture data,
   **When** it imports the dedicated mock entry point, **Then** the existing fixtures
   remain available without becoming part of the package root exports.
3. **Given** production builds for Web and Mobile, **When** their bundle contents are
   inspected, **Then** mock fixture data is absent from both bundles.

---

### User Story 3 - Share the API Contract Across Applications (Priority: P1)

As a maintainer, I need the API contract and its generation configuration owned by the
shared package so that Web and Mobile consume one consistent source of generated
endpoints.

**Why this priority**: Keeping the contract under one application creates a misleading
ownership boundary and makes shared API generation dependent on Web-specific files.

**Independent Test**: Run API client generation from the shared package and verify that
the generated client is available to both applications without relying on contract or
configuration files under Web.

**Acceptance Scenarios**:

1. **Given** the shared package, **When** its API generation command is run, **Then**
   it reads the OpenAPI contract and Orval configuration owned by that package and
   writes the generated artifacts within the shared package.
2. **Given** the contract and generator configuration have moved, **When** Web or
   Mobile consumes generated endpoints, **Then** neither consumer requires a duplicate
   contract or generator configuration under its application directory.
3. **Given** a generation or validation failure, **When** the command finishes,
   **Then** it reports failure and does not present stale generated artifacts as
   current output.

---

### User Story 4 - Provide Mobile Navigation and JWT Session State (Priority: P1)

As a Mobile user, I need navigation to reflect whether I have a valid authenticated
session so that private API requests can be made with my JWT and unauthenticated
requests cannot accidentally use a stale token.

**Why this priority**: Mobile currently needs an explicit native routing foundation and
session state before it can reliably consume authenticated endpoints.

**Independent Test**: Exercise unauthenticated, authenticated, sign-out, and rejected
token states, verifying navigation state and the authorization header for private
requests at each stage.

**Acceptance Scenarios**:

1. **Given** no valid JWT is available, **When** the Mobile application starts or a
   private request is attempted, **Then** the session is unauthenticated and no bearer
   token is sent.
2. **Given** authentication provides a valid JWT, **When** the session is established,
   **Then** Mobile records the authenticated state and private requests include that
   JWT as a bearer credential.
3. **Given** the user signs out or the service rejects the JWT as invalid or expired,
   **When** the session changes, **Then** the JWT is cleared, private navigation is
   removed, and subsequent private requests do not send the rejected token.
4. **Given** a JWT is persisted between application launches, **When** the application
   restores the session, **Then** the credential is kept in platform-protected storage
   rather than ordinary unencrypted application storage.

---

### Edge Cases

- An OpenAPI tag contains uppercase letters, underscores, repeated hyphens, whitespace,
  punctuation, or non-ASCII characters; validation must identify the invalid name.
- A mock module is imported transitively through another root export; production bundle
  checks must still detect the fixture data.
- API generation is invoked from the repository root or either application; it must
  resolve the shared contract and configuration without creating competing outputs.
- Mobile starts without a JWT, cannot restore protected session state, or receives an
  unauthorized response; it must remain unauthenticated and avoid sending credentials.
- The API rejects a previously valid JWT; the local session and any protected route
  state must be cleared.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The OpenAPI contract MUST name every tag used to group generated endpoint
  artifacts using lowercase ASCII kebab-case matching
  `^[a-z0-9]+(-[a-z0-9]+)*$`.
- **FR-002**: The API generation configuration MUST validate or otherwise fail
  generation when a grouping tag violates FR-001; it MUST NOT silently emit unsafe
  grouping names.
- **FR-003**: The shared package root entry point MUST NOT re-export the
  `mockGigs.ts` or `mockContractorData.ts` datasets.
- **FR-004**: Mock fixtures MUST remain available only through an explicit
  development/test import path and MUST NOT be pulled into production Web or Mobile
  bundles through ordinary package imports.
- **FR-005**: The OpenAPI contract and Orval configuration MUST be owned and executed
  from `packages/shared`; generated API artifacts MUST be emitted within that package.
- **FR-006**: Web and Mobile MUST be able to consume the shared generated client without
  maintaining application-local copies of the contract or generator configuration.
- **FR-007**: Mobile MUST provide a native navigation foundation under its
  `navigation/` directory that can distinguish unauthenticated routes from routes
  requiring an authenticated session.
- **FR-008**: Mobile MUST maintain explicit authenticated and unauthenticated JWT
  session states and include a bearer credential only on private requests when a valid
  session token is present.
- **FR-009**: Mobile MUST clear the local JWT and protected navigation state on sign-out
  or when the service rejects the token as invalid or expired.
- **FR-010**: Any JWT persisted across application launches MUST use platform-protected
  credential storage; it MUST NOT be stored as plaintext in ordinary application
  storage.
- **FR-011**: Mobile navigation and client-side session state MUST NOT be treated as a
  replacement for server-side authorization or role enforcement.

### Key Entities *(include if feature involves data)*

- **OpenAPI Tag**: A contract label used to group generated endpoint artifacts; its
  name follows the lowercase ASCII kebab-case constraint.
- **Mock Fixture Dataset**: Development or test data currently provided by the mock
  gig and contractor data modules; it is not part of the shared package's root
  production-facing exports.
- **Mobile Authentication Session**: The current authenticated state and its JWT
  credential, including restoration, use on private requests, and invalidation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of OpenAPI tags used for generated endpoint groups pass the
  lowercase ASCII kebab-case validation rule before generation.
- **SC-002**: 0 mock fixture exports are reachable from the shared package root, and
  0 fixture dataset bytes are present in either production application bundle.
- **SC-003**: API client generation succeeds when invoked from the shared package, and
  both Web and Mobile can type-check against the resulting shared client.
- **SC-004**: In all tested unauthenticated, authenticated, sign-out, and rejected-token
  cases, private requests include a bearer JWT if and only if the session has a valid
  token; sign-out or rejection clears the local token and protected navigation state.

## Assumptions

- Existing REST endpoints and their authorization semantics remain owned by the API
  service; this feature changes client and repository architecture, not server
  authorization behavior.
- OpenAPI tag names are the grouping names that must use kebab-case ASCII. HTTP paths
  and operation identifiers retain their existing API semantics unless separately
  required by the contract; normalization must not silently change endpoint URLs.
- Mock datasets remain usable in tests and explicit development scenarios through a
  dedicated import path, but are excluded from normal production imports.
- Mobile uses the project's existing JWT authentication contract. Credential
  persistence, when required, uses platform-protected storage; token refresh behavior
  is not expanded beyond the existing service contract in this feature.
- The existing Web authentication flow and user-facing business behavior are not
  otherwise redesigned by this infrastructure-focused feature.
