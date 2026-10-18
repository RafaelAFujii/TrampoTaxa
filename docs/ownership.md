# Project ownership

Repository maintainers have confirmed the named individual below as the verified owner for all operational areas and exception approvals.

| Area                            | Responsibility                                                        | Verified GitHub owner |
| ------------------------------- | --------------------------------------------------------------------- | --------------------- |
| Web (`apps/web/`)               | React/Vite application and Web release build                          | @RafaelAFujii         |
| Mobile (`apps/mobile/`)         | Expo/React Native application and native session controls             | @RafaelAFujii         |
| Shared/API (`packages/shared/`) | Shared domain code, canonical OpenAPI contract, and generated clients | @RafaelAFujii         |
| Security                        | Vulnerability triage and security-risk disposition                    | @RafaelAFujii         |
| Release/CI (`.github/`)         | Required workflows, branch protection, and Pages release              | @RafaelAFujii         |

These verified role assignments are active for review routing and CODEOWNERS
configuration.

## Exception approvers

Only entries explicitly marked **Verified** may approve a security-risk or other
mandatory release-gate exception. The approved exception must be tied to the
candidate revision and gate, record approval date, rationale, and scope, and expire
within 30 calendar days. A designated maintainer may approve only when no verified
security owner is available.

| Role                  | GitHub identity | Verification |
| --------------------- | --------------- | ------------ |
| Security owner        | @RafaelAFujii   | Verified     |
| Designated maintainer | @RafaelAFujii   | Verified     |
