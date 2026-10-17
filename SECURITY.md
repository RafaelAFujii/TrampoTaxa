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

Exceptions require `approvedBy`, `rationale`, `scope`, and a future UTC `expiresAt`,
and must comply with the project constitution. The approver must match a verified
security owner recorded in [`docs/ownership.md`](docs/ownership.md). A formally
designated maintainer may approve only when no verified security owner is available.
If neither authority is verified, the release gate rejects every exception and the
risk remains blocking. The gate fails closed for missing or malformed risk data.

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
