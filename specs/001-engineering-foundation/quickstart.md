# Quickstart: Validate the Engineering Foundation

This guide defines local checks and CI acceptance scenarios for the current
`apps/web`, `apps/mobile`, and `packages/shared` workspaces. Run commands from the
repository root unless noted.

## Prerequisites

- Bun and repository dependencies installed with `bun install`.
- Maintainer-configured protected `SONAR_TOKEN` secret in CI; organization and project
  key are set in `sonar-project.properties`.
- GitHub branch protection configured for required workflow checks and verified
  code-owner identities.

## Local Validation

1. Install workspace dependencies:

   ```powershell
   bun install
   ```

2. Run root tests and workspace tests:

   ```powershell
   bun test
   bun run --filter mobile test
   bun run --filter @trampotaxa/shared test
   ```

   Expected: every applicable test exits successfully.

3. Run Web lint/type checks and production build:

   ```powershell
   bun run lint
   bun run build:web
   ```

   Expected: ESLint has zero errors, TypeScript succeeds, and Vite creates its
   production build.

4. Validate Mobile types and Expo configuration:

   ```powershell
   bun run --filter mobile typecheck
   Set-Location apps/mobile
   bunx expo config --type public
   Set-Location ../..
   ```

   Expected: type checking passes and Expo emits a valid public configuration without
   secrets.

5. Regenerate API artifacts from the shared canonical contract:

   ```powershell
   bun run api:generate
   git status --short -- packages/shared/src/api
   ```

   Expected: tag validation and Orval succeed; committed generated files are current
   and the command creates no unexpected tracked changes. If output changes, review
   the generation diff, update the generated artifacts intentionally, and rerun.

6. Check the production security-risk gate:

   ```powershell
   bun run apps/web/scripts/check-release-risks.ts
   ```

   Expected for the current risk register: a non-zero exit identifying
   `WEB-AUTH-001`, `MOBILE-AUTH-001`, and `SERVER-AUTHZ-001`. Each unresolved risk
   must be HIGH or CRITICAL. No exception is accepted until its approver matches a
   verified owner recorded in `docs/ownership.md`.

7. Verify exception behavior with the release-risk tests. A valid exception uses
   an identified gate and candidate revision, verified `approvedBy`, `approvedAt`,
   `rationale`, `scope`, and UTC `expiresAt` no more than 30 calendar days after
   approval. A designated maintainer may approve only if no verified security owner
   is available. Expired, overlong, malformed, incomplete, unauthorized, or
   unverified exceptions fail closed. Missing or unavailable required check results
   remain blocking even when an exception is present.

8. Validate exceptions to non-security release gates with the dedicated release
   exception validator and its tests:

   ```powershell
   bun run --filter web test -- src/__tests__/release-risk-gate.test.ts src/__tests__/release-exception-gate.test.ts
   ```

   The deployment workflow supplies `GITHUB_SHA` and the JSON status output from
   `.github/workflows/quality.yml` to `bun run apps/web/scripts/check-release-exceptions.ts`.
   Confirm a Sonar threshold exception applies only to the named candidate revision
   and does not suppress other failing gates. Run the validator directly only when
   both environment variables are set to an actual candidate and workflow result.

## Pull-Request Acceptance

For every test PR (including documentation-only changes), confirm:

- One standard PR template asks for affected areas, evidence, and security/data impact.
- Full Web, Mobile, shared, and API-generation checks run regardless of changed paths.
- Missing or failed checks block merge eligibility.
- Sonar debt ratio is strictly below 10%, and ESLint reports zero errors.
- Any approved exception to a mandatory production-release gate is limited to 30
  calendar days, scoped to the named candidate revision and failed gate, and does not
  waive missing or unavailable required checks.
- API generation uses `packages/shared/openapi.yaml` and
  `packages/shared/orval.config.ts`; a stale generated diff fails validation.
- Updated documentation points to the canonical shared contract; no divergent
  `docs/openapi.yaml` copy remains.

## Security and Release Acceptance

- Mobile session restoration, secure storage, request headers, unauthorized handling,
  and protected-navigation tests pass. These verify local session controls only.
- The Mobile local context is not described as a missing feature, but end-to-end token
  issuance and server authorization remain open until separately tested.
- Web mock login and unresolved server-side authorization are present in the risk
  register with owners and documented dispositions.
- Pages deployment runs only after the same revision passes all required checks and
  the risk gate, or an approved, valid exception covers each failed gate. Unresolved
  critical/high risks require verified remediation or a documented exception that
  complies with the 30-calendar-day limit.

Detailed gate behavior is defined in
[contracts/change-release-gates.md](./contracts/change-release-gates.md); process
record fields and lifecycle are in [data-model.md](./data-model.md).
