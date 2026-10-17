# Project ownership

Repository maintainers have confirmed the named individual below as the verified owner for all operational areas and exception approvals.

| Area                            | Responsibility                                                        | Verified GitHub owner         |
| ------------------------------- | --------------------------------------------------------------------- | ------------------------------- |
| Web (`apps/web/`)               | React/Vite application and Web release build                          | @RafaelAFujii                   |
| Mobile (`apps/mobile/`)         | Expo/React Native application and native session controls             | @RafaelAFujii                   |
| Shared/API (`packages/shared/`) | Shared domain code, canonical OpenAPI contract, and generated clients | @RafaelAFujii                   |
| Security                        | Vulnerability triage and security-risk disposition                    | @RafaelAFujii                   |
| Release/CI (`.github/`)         | Required workflows, branch protection, and Pages release              | @RafaelAFujii                   |

With verified handles supplied, these role assignments are active for review routing and CODEOWNERS configuration. See task T001 in
`specs/001-engineering-foundation/tasks.md`.

## Exception approvers

Only entries explicitly marked **Verified** are authorized to approve a temporary
exception for a high- or critical-severity security risk. 

| Role                  | GitHub identity               | Verification |
| --------------------- | ----------------------------- | ------------ |
| Security owner        | @RafaelAFujii                 | Verified     |
| Designated maintainer | @RafaelAFujii                 | Verified     |