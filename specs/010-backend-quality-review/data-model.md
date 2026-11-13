# Data Model: Revisão da Qualidade do Backend

The following entities describe the assessment records and report contents. They do not add persistence to the backend; the assessment is recorded in a review artifact.

## Assessment

Represents one bounded review of the selected backend.

| Field | Meaning | Validation |
|---|---|---|
| `assessmentId` | Stable identifier for the review | Unique within the report |
| `scope` | Backend paths and concerns reviewed | Must match the approved scope |
| `startedAt`, `completedAt` | Review interval | Completion cannot precede start |
| `readiness` | Overall conclusion: `ready`, `ready-with-limitations`, or `blocked` | Must be justified by findings and limitations |
| `limitations` | Checks not completed and why | Each blocked/not-run check has a reason |

## Scope Item

Represents an in-scope component or review area.

| Field | Meaning | Validation |
|---|---|---|
| `pathOrArea` | Source, tests, configuration, docs, or behavior area | Must be within the approved backend boundary |
| `disposition` | `reviewed`, `not-reviewed`, or `excluded` | Non-reviewed items include a reason |
| `evidence` | References supporting the disposition | Must be locatable |

An assessment contains one or more scope items.

## Check

Represents a static, build, test, or manual verification.

| Field | Meaning | Validation |
|---|---|---|
| `checkId` | Stable check identifier | Unique within the assessment |
| `description` | What the check verifies | Must be understandable and bounded |
| `commandOrMethod` | Exact command or manual method, if applicable | Never invent a result for a check not run |
| `status` | `passed`, `failed`, `blocked`, or `not-run` | Blocked/not-run requires a cause |
| `resultEvidence` | Relevant output, location, or note | Must not contain secret values |
| `testEnvironment` | Environment and database isolation description for runtime checks | Performance checks require a disposable isolated environment; do not include secret connection values |
| `workloadProfile` | Read-only endpoint set, virtual-user count, and duration for a load check | Required for performance/load checks; the planned baseline starts at 10 VUs for 30 seconds |
| `latencyP95Ms` | 95th-percentile HTTP request duration | Required when a performance baseline ran |
| `throughputRequestsPerSecond` | HTTP request throughput observed during the measured interval | Required when a performance baseline ran |
| `errorRate` | Fraction or percentage of failed HTTP requests | Required when a performance baseline ran |
| `evaluationMode` | `baseline` or `threshold` | Current owner decision is `baseline`; do not infer pass/fail without agreed targets |

An assessment contains checks. A failed check may support one or more findings. For a baseline-mode load check, `status` describes whether the test executed successfully, not whether the service met an SLO.

## Finding

Represents a confirmed defect, potential risk, debt item, or assessment limitation.

| Field | Meaning | Validation |
|---|---|---|
| `findingId` | Stable identifier | Unique within the assessment |
| `category` | `defect`, `risk`, `technical-debt`, or `limitation` | Exactly one primary category |
| `severity` | `critical`, `high`, `medium`, `low`, or `not-applicable` | Use the impact definitions in the specification |
| `confirmation` | `confirmed` or `unconfirmed` | Unconfirmed items are not stated as defects |
| `evidence` | File/location or observed behavior | Must be verifiable and safe to share |
| `impact` | User or operational consequence | Required for confirmed defects and material risks |
| `verificationSteps` | Reproduction or validation guidance | Must not target production data or systems |
| `recommendation` | Suggested next action | Prioritized and in scope |

## Cleanup Candidate

Represents a file or artifact proposed for cleanup, not an authorization to remove it.

| Field | Meaning | Validation |
|---|---|---|
| `candidatePath` | Repository-relative path | Must be inside the backend cleanup boundary |
| `classification` | Generated output, temporary/debug residue, duplicate, or other justified category | Filename alone is insufficient evidence |
| `trackedState` | Whether the path is tracked by version control | Must be checked before proposing untracking/removal |
| `usageChecks` | References, fixtures, runtime use, or documentation checked | Required before recommending removal |
| `regenerationCheck` | Whether the file can be recreated safely | Required for generated outputs |
| `disposition` | `proposed-remove`, `retain`, or `needs-review` | `proposed-remove` requires all safety checks |
| `approval` | `pending`, `approved`, or `rejected` | Defaults to `pending`; no removal while pending |

An assessment contains cleanup candidates. Each candidate has exactly one disposition and approval state.

## Recommendation

Represents a prioritized next action linked to findings or cleanup candidates.

| Field | Meaning | Validation |
|---|---|---|
| `priority` | Ordered action priority | Higher impact and likelihood come first |
| `description` | Action the owner can take | Concrete and bounded |
| `relatedItems` | Finding or candidate identifiers | At least one reference |
| `approvalRequired` | Whether work requires separate approval | Always true for cleanup or behavior changes |
