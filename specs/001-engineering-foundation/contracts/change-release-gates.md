# Change and Release Gate Contract

This contract describes expected interactions among contributors, reviewers,
GitHub Actions, the shared API generator, risk records, and Pages deployment.

## Pull Request

1. Every pull request to a production branch receives the single standard
   `.github/pull_request_template.md`, without selecting a path-specific validation
   subset.
2. The template captures purpose, affected areas (`apps/web`, `apps/mobile`,
   `packages/shared` including API contract/client, and workflow/docs), verification
   evidence, security/data impact, risk links, and skipped checks.
3. The required quality workflow validates every workspace on every PR:
   - Root `bun test`.
   - Web `bun run lint` and `bun run build:web`.
   - Mobile tests, typecheck, and Expo public configuration.
   - Shared tests and API generation via root `bun run api:generate`.
   - Generated artifact cleanliness after API generation.
   - Sonar analysis and its quality gate.
4. A missing/failing/unavailable required check blocks the PR. Sonar debt ratio must
   be `< 10%`; ESLint must report zero errors.
5. The API contract is canonical only at `packages/shared/openapi.yaml`, with
   `packages/shared/orval.config.ts`. No stale/divergent root `docs/openapi.yaml` copy
   or old Web-owned path may remain in maintained documentation.
6. Security-sensitive changes require review from the verified security owner role.
   Cross-workspace changes retain evidence for the affected areas even though the
   complete matrix runs.
7. Required status checks and code-owner approval must be enabled in repository
   branch protection; workflow configuration alone does not enforce merge protection.

## Production Release

1. A production release candidate is the same revision that passed required CI and
   maintainer approval.
2. Pages deployment depends on successful validation of that revision, including full
   workspace checks, Sonar, current generated API output, and security-risk gate.
3. Missing or failed checks, Sonar debt ratio `>= 10%`, ESLint errors, stale generated
   artifacts, or unresolved critical/high security risks block deployment unless an
   exception permitted by the constitution is recorded.
4. Mobile AuthContext, SecureStore persistence, bearer request handling, and protected
   navigation are existing local controls; they do not alone prove end-to-end token
   issuance or server-side authorization.
5. The Web simulated login and unverified server authorization remain open risks until
   verified end to end. They must not be marked mitigated based only on client-side
   navigation or request-header behavior.
6. CI service outage or missing Sonar secret is not a pass; release remains blocked.

## Evidence

GitHub Actions records check results; pull requests record affected areas and review;
the security-risk register links owners, status, and evidence; the release record
identifies deployed revision and outcome.
