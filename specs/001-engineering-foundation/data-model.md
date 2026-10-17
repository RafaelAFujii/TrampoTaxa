# Data Model: Engineering Foundation

No application database is introduced. Process state is represented by pull requests,
Actions check results, a repository security-risk register, and quality/ownership
documentation.

## Change

Represents a proposed repository modification.

| Field | Meaning | Validation |
|---|---|---|
| Identifier | Pull request reference | Unique in repository review history |
| Author | Contributor proposing the change | Must be a repository contributor |
| Affected areas | Web, Mobile, shared/API, workflow, documentation, or security | At least one area must be selected in the PR template |
| Security/data impact | Summary of sensitive behavior affected | Required for identity, authorization, sensitive data, or privileged operations |
| Verification evidence | Required CI checks, generation state, and human review | All required checks pass before approval or deployment |
| Review state | Draft, ready, blocked, approved, merged | Missing/failed required checks means blocked |

## Quality Indicator

Represents a repeatable engineering measurement.

| Field | Meaning | Validation |
|---|---|---|
| Name | Sonar debt ratio, ESLint error count, workspace tests, build/type checks | Must have a defined result source |
| Source | Required PR workflow or approved review record | Must be discoverable in GitHub Actions |
| Threshold | Acceptance boundary | Sonar debt ratio `< 10%`; ESLint errors `0`; other required checks pass |
| Measurement point | When evaluated | Every pull request and production release candidate |
| Owner | Accountable maintainer role | Must map to a verified GitHub identity |
| Result | Value and pass/fail state | Missing or failed mandatory result blocks progression |

## Security Risk

Represents an unresolved security weakness or missing product control.

| Field | Meaning | Validation |
|---|---|---|
| Identifier | Stable risk reference | Unique and traceable to a review or issue |
| Severity | Critical, high, medium, or low | Assigned using the documented triage policy |
| Affected area | Web authentication, Mobile login/token issuance, server authorization, or another capability | Required |
| Owner role | Maintainer responsible for disposition | Required for critical/high risks |
| Status | Open, mitigated, excepted, or closed | Closure requires verification evidence |
| Exception | Approver, reason, scope, and expiry/removal condition | Required for any accepted risk; must satisfy constitution governance |
| Evidence | Implementation/test/review records supporting disposition | Local session/navigation alone cannot prove token issuer or server authorization |

The Mobile session context and protected navigation are existing controls and must not
be listed as missing. The Web simulated login, end-to-end Mobile token acquisition, and
server-side authorization remain open unless separately verified.

## Release

Represents a production deployment candidate.

| Field | Meaning | Validation |
|---|---|---|
| Revision | Commit intended for deployment | Must match the revision whose checks passed |
| Required checks | Full Web, Mobile, shared/API, Sonar, and risk-gate results | All must pass |
| Security disposition | Status of critical/high risks | Must be closed or have a permitted documented exception |
| Approval | Required maintainer and code-owner review | Must exist before deployment |
| Outcome | Blocked, approved, deployed, or failed | Deployment cannot precede approval |

## Project Area

Represents a maintained workspace or operational concern.

| Field | Meaning | Validation |
|---|---|---|
| Path/responsibility | `apps/web`, `apps/mobile`, `packages/shared`, security, or release workflow | Must match current repository structure |
| Owner role | Accountable maintainer | Must be explicitly assigned |
| GitHub identity | Team/user handle used by CODEOWNERS | Must be verified and valid before enforcement |

## Lifecycle

- A pull request identifies affected areas and risks before required validation.
- Any failed, missing, or unavailable required check leaves the change blocked.
- A revision is eligible for deployment only when the same revision passed all gates
  and required review.
- A security risk remains open until verified remediation or an approved,
  time-bounded exception.
- Generated API output is current only when shared generation completes and leaves no
  unexpected tracked diff.
