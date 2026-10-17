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
assigns severity, affected area, accountable owner role, status, disposition, and
verification evidence. Critical and high findings block production while open.
Mitigated or closed findings require evidence. Exceptions require a named approver,
reason, scope, and future expiry, and must comply with the project constitution.

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
