# Implementation Plan: Engineering Foundation

**Branch**: `001-engineering-foundation` | **Date**: 2026-10-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-engineering-foundation/spec.md`

## Summary

Establish a discoverable contributor and release workflow for the current Bun
monorepo (`apps/web`, `apps/mobile`, `packages/shared`). Run the full Web, Mobile,
shared-package, and generated API validation suite on every pull request; gate
GitHub Pages deployment on successful validation; add a single PR template, ownership
and security guidance, automated Sonar analysis, and release-risk tracking.

The separate architecture refactor has already delivered the Mobile session context,
protected native navigation, secure token storage, mock subpath exports, and canonical
OpenAPI/Orval files under `packages/shared`. This plan treats those as existing
controls. It does not implement end-to-end login/token issuance or server-side
authorization; unresolved Web and server-side authentication risks remain production
release blockers unless resolved or covered by a constitution-compliant exception.

## Technical Context

**Language/Version**: TypeScript 5.8 for application and release-policy logic;
GitHub Actions YAML and Markdown for workflow and policy configuration.

**Primary Dependencies**: Bun workspaces, GitHub Actions, Vitest, ESLint, TypeScript,
Vite, Expo SDK 51 / React Native, Orval, YAML parsing, and automated Sonar analysis.

**Storage**: No new application database. Pull requests, Actions check results,
GitHub issues, security-risk records, quality reports, and release records provide
process evidence.

**Testing**: `bun test`; Web `bun run lint` and `bun run build:web`; Mobile
`bun run --filter mobile test`, `bun run --filter mobile typecheck`, and Expo public
configuration validation; shared `bun run --filter @trampotaxa/shared test` and
`bun run api:generate`, followed by a generated-artifact cleanliness check; Sonar
analysis and quality gate.

**Target Platform**: Pull requests targeting `main` and `master`, plus the existing
GitHub Pages production release workflow.

**Project Type**: Bun-workspace monorepo containing a React/Vite Web app, an
Expo/React Native Mobile app, and a shared TypeScript package which owns
`packages/shared/openapi.yaml`, `packages/shared/orval.config.ts`, and generated API
artifacts.

**Performance Goals**: No runtime performance change. CI must execute the complete
validation set on each pull request; no duration target is defined by the feature.

**Constraints**: Preserve existing workspace boundaries. All application and release
policy logic MUST be TypeScript. Sonar's reported technical-debt ratio MUST be below
10%, and ESLint MUST report zero errors. Every PR MUST validate all workspaces and
generated API output regardless of changed paths. The root-level `docs/openapi.yaml`
copy is divergent from the shared contract and MUST be removed; documentation must
identify `packages/shared/openapi.yaml` as canonical. Do not misrepresent Mobile's
local session context as end-to-end authentication.

**Scale/Scope**: Root contribution and security guidance, one PR template, maintainer
ownership, all-workspace PR CI, shared API generation integrity, Pages release gates,
and a machine-readable security-risk register. No new application services or
infrastructure hosting topology.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status and evidence |
|---|---|---|
| TypeScript for all application logic | New handwritten application or release-policy logic is TypeScript. | PASS — implementation scripts and application logic use TypeScript; workflow and policy declarations remain YAML/Markdown/data. |
| Platform architecture | Preserve Web/Vite, Mobile/React Native, and shared package ownership. | PASS — CI validates all current workspaces without restructuring runtime applications. |
| JWT, RBAC, and first access | Do not treat Mobile local session state as proof of token issuance or server-side authorization; record outstanding Web and server risks. | PASS WITH PRODUCTION RELEASE BLOCKER — Mobile session context and protected navigation exist; end-to-end Mobile login/token issuance, Web production authentication, and server authorization are not verified. |
| Test-first development | Test executable release-risk policy before implementation and run all applicable workspace tests. | PASS — release-risk tests precede the TypeScript gate implementation; CI invokes Web, Mobile, shared, and API-generation checks. |
| Quality and safe delivery | Require Sonar debt ratio `< 10%`, zero ESLint errors, and successful checks before Pages deployment. | PASS — Sonar is integrated as a required PR quality gate and Pages deployment depends on same-revision validation. |

Known product authentication gaps are not claimed as resolved by this process feature.
Production deployment remains blocked while critical/high authentication or
server-authorization risks are unresolved, except for an exception allowed by the
constitution.

## Project Structure

### Documentation (this feature)

```text
specs/001-engineering-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── tasks.md                 # Existing; refresh with /speckit-tasks separately
└── contracts/
    └── change-release-gates.md
```

### Source Code (repository root)

```text
CONTRIBUTING.md
SECURITY.md
README.md
.github/
├── CODEOWNERS
├── pull_request_template.md
└── workflows/
    ├── deploy.yml
    └── quality.yml
sonar-project.properties
docs/
├── ownership.md
├── quality-baseline.md
└── security-risks.json
apps/
├── web/
│   └── scripts/
│       └── check-release-risks.ts
└── mobile/
    ├── navigation/
    ├── src/context/AuthContext.tsx
    └── src/api/authenticatedFetch.ts
packages/
└── shared/
    ├── openapi.yaml
    ├── orval.config.ts
    ├── scripts/validate-openapi-tags.ts
    └── src/api/
```

**Structure Decision**: Keep the current monorepo layout and canonical API ownership.
Use `.github/workflows/quality.yml` as the PR gate without path filters, so all checks
run on every PR. The workflow runs shared API generation and fails if generation leaves
tracked outputs dirty. `deploy.yml` depends on successful validation of the same
revision. Replace outdated root/docs and mobile-risk assumptions in contributor docs,
security records, and CI; do not recreate `apps/web/orval.config.ts` or
`apps/web/docs/openapi.yaml`.

## Complexity Tracking

| Item | Justification and containment |
|---|---|
| Separate release-risk validation script | The risk register is an explicit release gate. Keep it as a focused TypeScript script with testable validation rules and fail-closed behavior. |
| Full validation for every PR | Explicitly selected to prevent shared API or cross-workspace changes from bypassing checks; accept higher CI cost over fragile path filters. |
| Sonar project and GitHub secret setup | Required to measure the constitution's debt threshold. Maintainers must configure the project key and protected token before making the Sonar gate required. |
