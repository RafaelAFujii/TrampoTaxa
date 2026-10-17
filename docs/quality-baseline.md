# Quality baseline

The quality workflow evaluates all supported workspaces on every pull request and
before GitHub Pages deployment. Missing results are unverified, not passing.

| Indicator                      | Source                                                                               | Threshold                    | Cadence                        | Owner role                         | Failure response                                                |
| ------------------------------ | ------------------------------------------------------------------------------------ | ---------------------------- | ------------------------------ | ---------------------------------- | --------------------------------------------------------------- |
| Sonar technical-debt ratio     | Sonar analysis in `.github/workflows/quality.yml` (`sqale_debt_ratio`)               | Strictly below 10%           | Every PR and release candidate | Release/CI maintainer              | Block merge/release; record remediation before retry            |
| ESLint errors                  | Web lint script (`bun run --filter web lint`)                                        | 0 errors                     | Every PR and release candidate | Web maintainer                     | Fix errors; warnings do not change the zero-error requirement   |
| Vitest suites                  | Root, Web, Mobile, and shared workspace test commands                                | All required suites pass     | Every PR and release candidate | Maintainers of affected workspaces | Block progression; reproduce and track failures                 |
| Type checks                    | Web lint's TypeScript check and Mobile `typecheck` script                            | Both pass                    | Every PR and release candidate | Web and Mobile maintainers         | Correct type errors before approval                             |
| Production build/configuration | Web Vite build and Expo public configuration                                         | Both succeed                 | Every PR and release candidate | Web and Mobile maintainers         | Block release and fix configuration/build errors                |
| Generated API freshness        | Shared Orval generation followed by clean Git status under `packages/shared/src/api` | No unexpected generated diff | Every PR and release candidate | Shared/API maintainer              | Regenerate and review intended output; commit current artifacts |

## Baseline status

- Sonar: **Not measured**. The SonarCloud project is configured in
  `sonar-project.properties`; a protected `SONAR_TOKEN` must be configured, then a
  successful analysis must record the measured ratio.
- ESLint: **0 errors and 0 warnings** in the local run on 2026-10-17 using
  `bun run --filter web lint`; this is a local baseline, not a GitHub Actions result.
- Ownership: GitHub handles for each owner role are pending confirmation in
  `docs/ownership.md`.

Record each measured baseline with its date, workflow run, result, and unresolved
findings. Update this document when a check or its threshold changes.
