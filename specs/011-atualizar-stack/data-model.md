# Data Model: Technology Upgrade Inventory

This feature adds no product database entities or migrations. Its records are maintenance artifacts that let maintainers audit version support and validation evidence.

## Entities

### Technology Entry

One record for each directly declared dependency, runtime, framework, build/test tool, CI action, or delivery tool used by an in-scope workspace.

| Field | Description | Validation |
|---|---|---|
| `workspace` | Root or repository workspace that owns the technology | Must identify an in-scope workspace |
| `component` | Technology or package name | Required; unique with `workspace` |
| `role` | Runtime, framework, dependency, build/test tool, CI action, or delivery tool | One documented category |
| `declaredVersion` | Version or range currently declared in the owning manifest/configuration | Required for the baseline |
| `resolvedVersion` | Exact installed/locked version for package dependencies | Required when a lock or restore resolution exists |
| `targetVersion` | Latest stable target accepted for this upgrade | Must be supported and compatible, or associated with an approved exception |
| `supportStatus` | Vendor support state at evaluation time | `active`, `maintenance`, `end-of-support`, or `unknown` |
| `supportEvidence` | Official source and date used to establish the target/support state | Required before approval |
| `compatibilityNotes` | Constraints imposed by coupled frameworks, peer dependencies, or project architecture | Record when applicable |
| `verification` | Validation command/result references for affected workspaces | Record every applicable required check |
| `outcome` | Current disposition of the upgrade | `pending`, `updated-verified`, `exception`, or `blocked` |

Transitive packages are represented by the workspace lock/restore result, not one row per package. Record transitive packages individually only when a support or security finding requires an explicit disposition.

### Upgrade Exception

An exception represents an in-scope technology that cannot be moved to the selected target.

| Field | Description | Validation |
|---|---|---|
| `component` | Related technology entry | Must reference an inventory entry |
| `reason` | Specific compatibility, support, or hosting constraint | Required; no generic "not updated" reason |
| `risk` | User, security, and maintenance impact of deferral | Required |
| `owner` | Person or role accountable for resolution | Required |
| `dueDate` | Date by which the exception must be revisited/resolved | Required |
| `approval` | Approver and approval date | Required for an accepted exception |
| `mitigation` | Interim steps that reduce risk | Required when risk is not negligible |

### Verification Record

Evidence that an affected workspace remains installable and functional after its upgrade.

| Field | Description | Validation |
|---|---|---|
| `workspace` | Application/service checked | Required |
| `check` | Test, build, type, configuration, or advisory check | Required |
| `status` | Observed result | `passed`, `failed`, `blocked`, or `not-run` |
| `evidence` | Command, CI run, or output reference | Required; blocked/not-run records include a cause |
| `checkedAt` | Date of observation | Required |

## Relationships and lifecycle

- Each `Technology Entry` can have zero or one accepted `Upgrade Exception`.
- Each `Technology Entry` can have multiple `Verification Records` for its owning workspace.
- Normal upgrade: `pending` → `updated-verified`.
- Deferred upgrade: `pending` → `exception` only after approval and required exception fields are complete.
- Missing source evidence or unavailable checks leave the entry `blocked`; they do not count as successful completion.
