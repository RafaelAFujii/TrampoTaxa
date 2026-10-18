# Security policy

## Reporting a vulnerability

Do not report exploitable details in a public issue or pull request. If GitHub
private vulnerability reporting is enabled for this repository, use the repository's
**Security** tab to submit an advisory privately. Otherwise, contact a verified
maintainer through the private channel recorded in [`docs/ownership.md`](docs/ownership.md).
Maintainers must publish a private contact route there before relying on it.

Do not include credentials, access tokens, personal data, or production exploit
payloads in public discussions.

## Triage and response

The security maintainer records each finding in `docs/security-risks.json` and
assigns category, severity, affected area, accountable owner role, status, disposition,
and verification evidence. Unresolved Web sign-in, Mobile end-to-end authentication,
and server-side access-control risks are HIGH at minimum and block production;
triage may raise them to CRITICAL. The register must retain all three categories;
missing or misclassified required records also block release. Mitigated or closed
findings require evidence.

An exception to any mandatory production-release gate must identify the gate and
candidate revision, verified `approvedBy`, UTC `approvedAt`, `rationale`, `scope`,
and UTC `expiresAt`. Expiry must be no more than 30 calendar days after approval;
continuing an exception requires new approval before expiry. Security-risk exceptions
are recorded with their risk in `docs/security-risks.json`; other gate exceptions use
`docs/release-exceptions.json`. The approver must match a verified security owner
recorded in [`docs/ownership.md`](docs/ownership.md). A formally designated maintainer
may approve only when no verified security owner is available. If neither authority
is verified, the release gate rejects every exception. Missing or unavailable
verification, CI prerequisites, or Sonar analysis results cannot be waived.

The deployment workflow accepts exceptions only for available failed checks and
keeps the pull-request quality workflow failing for any failed required check.
An exception recorded in either JSON file must be reviewed through the repository's
required CODEOWNERS approval and branch protection; recording a GitHub identity alone
does not constitute approval.

Identity, authorization/RBAC, first-access flows, sensitive data, credentials, and
privileged operations require security review. Client-side route or UI guards alone
are not evidence of server authorization.

## Secrets and error handling

- Store CI credentials in protected GitHub Actions secrets; never commit them.
- Do not print secrets in logs, user-facing errors, screenshots, or test fixtures.
- Missing secrets or unavailable security analysis block the corresponding release
  gate; they are not treated as successful validation.

## Urgent security fixes

An urgent fix may use expedited review when delay would increase risk. Record the
reason, reviewer, tests and other verification performed, any skipped nonessential
step, follow-up owner, and due date in the pull request. Authentication, authorization,
and essential validation requirements remain in force.
