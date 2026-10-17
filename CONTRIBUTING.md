# Contributing to TrampoTaxa

This repository is a Bun-workspace monorepo. Web code belongs in `apps/web`,
React Native code in `apps/mobile`, and platform-independent models, utilities, API
contracts, and generated clients in `packages/shared`.

## Before opening a pull request

1. Review the relevant workspace documentation and identify every affected area.
2. For application behavior, write or update Vitest tests first and verify the
   red-green-refactor cycle.
3. Use the standard `.github/pull_request_template.md`. Describe security/data impact,
   relevant risk records, verification commands/results, and any checks that could not
   be run.
4. Treat `packages/shared/openapi.yaml` as the only API contract and
   `packages/shared/orval.config.ts` as the generator configuration. Generate clients
   from the repository root with `bun run api:generate`.

## Required verification

Every pull request to `main` or `master` runs the complete monorepo quality workflow,
without path filters. Required checks cover:

- Root, Web, Mobile, and shared-package Vitest suites.
- Web ESLint and TypeScript checks, Mobile TypeScript check, Expo public
  configuration, and the Web production build.
- Shared OpenAPI tag validation, Orval generation, and a clean generated-artifact
  check.
- Sonar analysis with a technical-debt ratio strictly below 10%; ESLint must report
  zero errors.

SonarCloud organization and project key are defined in `sonar-project.properties`.
Repository administrators must configure the protected `SONAR_TOKEN` secret before
the quality workflow can pass.

The expected branch-protection check is
`Monorepo Quality Gate / Complete Monorepo Validation`. Repository administrators
must configure that check as required on `main` and `master`, together with applicable
CODEOWNERS review. Verified owner handles are still pending in `docs/ownership.md`, so
`.github/CODEOWNERS` and enforceable code-owner review are not yet available. This
repository change cannot itself apply or verify organization branch-protection
settings.

If a required tool, secret, or service is unavailable, the change is not considered
validated. Do not bypass a failing check or report missing evidence as a pass. Pages
deployment must use the same revision that passed the reusable quality workflow and
the release-risk gate.

## Review and release

Changes affecting multiple workspaces must identify all affected areas even though CI
runs the complete matrix. Identity, authorization, sensitive-data, and privileged
operation changes require security review. Unresolved critical/high risks block
production unless a constitution-compliant exception is approved, scoped, and
time-bounded.

For quality-indicator definitions and remediation, see
[`docs/quality-baseline.md`](docs/quality-baseline.md). For vulnerability reporting
and urgent-fix handling, see [`SECURITY.md`](SECURITY.md).

## When a requirement is unclear

Do not invent project policy, maintainer identities, or security exceptions. Ask a
verified project maintainer before merging. Urgent security fixes may use the
expedited process in `SECURITY.md`, but must retain the essential verification and
record any follow-up.
