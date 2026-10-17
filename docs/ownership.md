# Project ownership

GitHub handles below are intentionally not guessed. Repository maintainers must
confirm named individuals or teams before enabling CODEOWNERS review or branch
protection.

| Area                            | Responsibility                                                        | Verified GitHub owner           |
| ------------------------------- | --------------------------------------------------------------------- | ------------------------------- |
| Web (`apps/web/`)               | React/Vite application and Web release build                          | Pending maintainer confirmation |
| Mobile (`apps/mobile/`)         | Expo/React Native application and native session controls             | Pending maintainer confirmation |
| Shared/API (`packages/shared/`) | Shared domain code, canonical OpenAPI contract, and generated clients | Pending maintainer confirmation |
| Security                        | Vulnerability triage and security-risk disposition                    | Pending maintainer confirmation |
| Release/CI (`.github/`)         | Required workflows, branch protection, and Pages release              | Pending maintainer confirmation |

Until verified handles are supplied, these role assignments are informational only;
they do not create an effective GitHub review rule. See task T001 in
`specs/001-engineering-foundation/tasks.md`.
