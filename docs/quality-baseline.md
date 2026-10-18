# Quality baseline

The quality workflow evaluates all supported workspaces on every pull request and
before GitHub Pages deployment. Missing results are unverified, not passing.

## Release-gate exceptions

An exception may cover only an available failed gate for the exact candidate
revision. It must identify the gate, revision, verified approver, approval timestamp,
rationale, scope, and expiry. Expiry is limited to 30 calendar days after approval;
an extension requires a new approval before the existing expiry. Missing or
unavailable checks, CI prerequisites, and Sonar credentials or service results are
not waivable. The deployment workflow validates `docs/release-exceptions.json` and
security-risk exceptions against the status output from the reusable quality
workflow; pull-request checks remain failing if any required gate fails.

| Indicator                      | Source                                                                               | Threshold                    | Cadence                        | Owner role                       | Failure response                                                |
| ------------------------------ | ------------------------------------------------------------------------------------ | ---------------------------- | ------------------------------ | -------------------------------- | --------------------------------------------------------------- |
| Sonar technical-debt ratio     | Sonar analysis in `.github/workflows/quality.yml` (`sqale_debt_ratio`)               | Strictly below 10%           | Every PR and release candidate | Release/CI maintainer            | Block merge/release; record remediation before retry            |
| ESLint errors                  | Web lint script (`bun run --filter web lint`)                                        | 0 errors                     | Every PR and release candidate | Web maintainer                   | Fix errors; warnings do not change the zero-error requirement   |
| Vitest suites                  | Root, Web, Mobile, and shared workspace test commands                                | All required suites pass     | Every PR and release candidate | Maintainers of affected workspaces | Block progression; reproduce and track failures                 |
| Type checks                    | Web lint's TypeScript check and Mobile `typecheck` script                            | Both pass                    | Every PR and release candidate | Web and Mobile maintainers       | Correct type errors before approval                           |
| Production build/configuration | Web Vite build and Expo public configuration                                         | Both succeed                 | Every PR and release candidate | Web and Mobile maintainers       | Block release and fix configuration/build errors                |
| Generated API freshness        | Shared Orval generation followed by clean Git status under `packages/shared/src/api` | No unexpected generated diff | Every PR and release candidate | Shared/API maintainer            | Regenerate and review intended output; commit current artifacts |

## Baseline status

- Sonar: **< 5% technical-debt ratio (Rating A)** recorded on 2026-10-17. Workflow evidence: https://github.com/RafaelAFujii/TrampoTaxa/actions/runs/39082413311.
- ESLint: **0 errors and 0 warnings** in the local run on 2026-10-17 using
  `bun run --filter web lint`; this is a local baseline, not a GitHub Actions result.
- Ownership: verified GitHub handles for the project-area owner roles are recorded
  in `docs/ownership.md`; required CODEOWNERS and branch-protection behavior still
  requires repository-level confirmation.

Record each measured baseline with its date, workflow run, result, and unresolved
findings. Update this document when a check or its threshold changes.