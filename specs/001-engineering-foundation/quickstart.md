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

   Expected for the current risk register: a non-zero exit that identifies the open
   Web authentication, Mobile end-to-end token, and server authorization risks.
   This is intentional; production release remains blocked until those risks are
   verified as resolved or have constitution-compliant exceptions.

## Pull-Request Acceptance

For every test PR (including documentation-only changes), confirm:

- One standard PR template asks for affected areas, evidence, and security/data impact.
- Full Web, Mobile, shared, and API-generation checks run regardless of changed paths.
- Missing or failed checks block merge eligibility.
- Sonar debt ratio is strictly below 10%, and ESLint reports zero errors.
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
  the risk gate. Unresolved critical/high risks require verified remediation or a
  constitution-compliant exception.

Detailed gate behavior is defined in
[contracts/change-release-gates.md](./contracts/change-release-gates.md); process
record fields and lifecycle are in [data-model.md](./data-model.md).
