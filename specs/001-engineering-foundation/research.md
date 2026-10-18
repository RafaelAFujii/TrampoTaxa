# Research: Engineering Foundation

## Current Repository Baseline

- Bun workspaces include `apps/web`, `apps/mobile`, and `packages/shared`.
- Web provides Vitest, ESLint plus TypeScript checking, and Vite production build.
- Mobile now provides Vitest and TypeScript scripts, `expo-secure-store`, a
  session `AuthContext`, authenticated fetch helpers, and a root navigator that gates
  protected tabs based on session state.
- Mobile tests exercise session restoration, sign-in/sign-out state transitions,
  secure-storage failures, bearer header behavior, unauthorized responses, and
  protected navigation.
- `packages/shared` owns `openapi.yaml`, `orval.config.ts`, the API generation
  script, tag validation, generated endpoints, and the dedicated `./mocks` entry.
- Root `api:generate` delegates to `@trampotaxa/shared`; Web no longer defines its
  own Orval generator script.
- At the start of this feature's implementation, `docs/openapi.yaml` differed from
  `packages/shared/openapi.yaml`, and the root README identified Web-owned OpenAPI
  paths. Implementation removed the divergent copy and updated maintained references
  to the shared contract.
- `.github/workflows/mobile-build.yml` runs Mobile checks on selected Mobile/shared
  paths. `.github/workflows/deploy.yml` runs tests, Web lint and build on production
  branch pushes or manual dispatch; there is no general workflow that runs the full
  validation matrix for every PR.
- No root PR template, CODEOWNERS mapping, Sonar configuration, or automated Sonar
  workflow was present at planning time. This implementation adds the PR template,
  Sonar project/workflow configuration, and leaves CODEOWNERS pending verified owner
  handles.
- Web login remains simulated; Mobile's local session context can accept/persist a
  token but the reviewed repository does not establish a production login/token
  issuer. No server-side authorization implementation was verified.

## Decision: Validate the Whole Monorepo on Every Pull Request

**Decision**: Run tests, Web lint/type check and build, Mobile test/type check and Expo
configuration validation, shared tests, API generation, generated-artifact cleanliness,
and Sonar analysis on every PR to the production branches. Do not path-filter the
required quality workflow.

**Rationale**: The user selected full validation for every PR. Shared API changes can
affect both applications even if a path filter or an incomplete path list would skip a
consumer check.

**Alternatives considered**: Path-selective checks with shared-to-app dependency
mapping; rejected because path filters can fail to run required checks or omit newly
added paths. Mobile's current filtered workflow may remain for its EAS-specific
validation, but cannot be the sole required full-quality gate.

## Decision: Verify Generated API Artifacts are Current

**Decision**: CI runs `bun run api:generate` from the root package script, which
delegates to the shared workspace's tag validator and Orval command. CI then fails if
the generation changes tracked output unexpectedly.

**Rationale**: `packages/shared/openapi.yaml` and `packages/shared/orval.config.ts`
are now canonical. Regeneration and a clean generated diff detect stale client output
and avoid Web-owned generator duplication.

**Alternatives considered**: Validate only OpenAPI tags; rejected because this does
not prove generated clients match the contract. Keep a duplicate root contract;
rejected because the existing copy differs from the canonical contract and could
reintroduce drift.

## Decision: Remove the Divergent Root OpenAPI Copy

**Decision**: Treat only `packages/shared/openapi.yaml` as canonical, remove
`docs/openapi.yaml`, and update root/docs references that identify old paths.

**Rationale**: The SHA-256 and size of the two copies differ. Keeping both without a
defined automated sync creates ambiguity about the source of truth.

**Alternatives considered**: Keep a manually synchronized copy; rejected because it
can drift. Keep it as an independent API; rejected because no separate ownership or
contract requirement exists.

## Decision: Recognize Delivered Mobile Session Infrastructure but Retain End-to-End Risks

**Decision**: Mark the Mobile session context and protected navigation as delivered
controls. Keep end-to-end login/token issuance and server-side authorization open risks;
keep Web's simulated authentication open as well.

**Rationale**: Current code includes SecureStore-backed local token state, a protected
navigation gate, and a request helper that adds bearer headers to declared private
operations and clears the session after a private 401. The reviewed code does not
establish a production identity provider/token issuer or server-side authorization.

**Alternatives considered**: Keep listing Mobile as having no session context;
rejected because the implementation and tests now exist. Treat local session state as
complete authentication; rejected because token acquisition and server enforcement are
not verified.

**Release implication**: Risk records must not describe the Mobile session provider
or guarded navigation as missing. Do not release production while critical/high
end-to-end authentication or server-authorization risks remain, unless an approved
exception satisfies the specification's approval and 30-calendar-day requirements.

## Decision: Use One Standard Pull-Request Template and Explicit Ownership

**Decision**: Create one `.github/pull_request_template.md` for affected areas,
verification evidence, security/data impact, and links to risks. Define project-area
responsibilities and map verified GitHub handles in `docs/ownership.md` and
`.github/CODEOWNERS`.

**Rationale**: A single template prevents Web/Mobile/shared process drift. Actual
maintainer identities are operational inputs and must not be guessed.

**Alternatives considered**: Author-selected per-workspace templates; rejected because
they can be skipped or diverge. Invent a catch-all owner; rejected because review
requests must route to real accountable maintainers.

## Decision: Automate Sonar Debt Measurement and Keep ESLint Independent

**Decision**: Run Sonar analysis in CI and fail its quality gate when the reported
technical-debt ratio is 10% or higher. Require ESLint to report zero errors.

**Rationale**: ESLint does not provide the requested technical-debt ratio. The user
selected automated Sonar analysis and clarified the distinct threshold for each tool.

**Operational prerequisite**: Keep the SonarCloud organization/project identifiers in
`sonar-project.properties` and configure the protected `SONAR_TOKEN` secret before
making the analysis a required check. Missing credentials, analysis failures, or
missing quality-gate results must fail rather than produce a success-shaped fallback.

## Decision: Use Explicit, Time-Bounded Release-Gate Exceptions

**Decision**: Represent an approved exception as a record tied to the specific gate
and release revision, with approver, approval date, rationale, scope, verification
evidence, and expiry. Require expiry no more than 30 calendar days after approval and
a new approval before any extension. Apply this rule to all mandatory
production-release gates, including the Sonar debt threshold. Keep missing or
unavailable required verification non-waivable. Keep security-risk exceptions
associated with their risk records and record other gate exceptions in a dedicated
release-exceptions register validated by TypeScript before deployment.

**Rationale**: The clarified spec applies the same maximum duration to any exception
that permits a release despite a mandatory gate. Binding the record to a gate and
revision prevents an approval from silently becoming a standing waiver. Existing
release-risk validation only checks that `expiresAt` is in the future; it does not
enforce a maximum duration or approval timestamp, so tests and validation must be
extended to enforce the new rule.

**Alternatives considered**: Leave the duration unspecified for non-security gates;
rejected because it permits indefinite quality-gate waivers. Reuse the security-risk
register for Sonar or other quality exceptions; rejected because those exceptions
would not represent security risks and could be confused with risk disposition.
Allow exceptions to cover missing or unavailable checks; rejected because the spec
requires those cases to remain blocked.

## Decision: Keep Process Evidence in Review and Risk Records

**Decision**: Record changes and check evidence in pull requests, project-area
ownership in `docs/ownership.md`, quality definitions/baselines in
`docs/quality-baseline.md`, and security gaps/exceptions in a validated risk register.

**Rationale**: The feature adds no application database. Repository artifacts and
GitHub review records provide traceable evidence without introducing a new service.

## Remaining Maintainer Inputs

- Verified GitHub teams/users for Web, Mobile, shared package, security, and release
  ownership.
- Sonar project key, protected analysis token, and configured debt-ratio quality gate.
- Repository branch-protection configuration and required check names.
- Security owner and risk severity/exception approval for actual end-to-end Web/Mobile
  authentication and server authorization gaps.
- Verified release-exception approver identities and the repository's protected
  workflow settings that enforce the exception validation check.
