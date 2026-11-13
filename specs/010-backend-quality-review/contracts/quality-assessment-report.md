# Contract: Backend Quality Assessment Report

## Purpose

Provide the backend owner with a review that is evidence-based, bounded, and explicit about unverified areas. The report is a review deliverable; this contract does not add or change a backend API endpoint.

## Required sections

1. **Scope and exclusions** — backend paths and behaviors reviewed, plus what was excluded.
2. **Executive conclusion** — `ready`, `ready-with-limitations`, or `blocked`, supported by the highest-priority findings and limitations.
3. **Checks** — each check's description, exact command or method, result (`passed`, `failed`, `blocked`, `not-run`), and evidence or reason.
4. **Findings** — confirmed defects, unconfirmed risks, technical debt, and assessment limitations, kept distinct.
5. **Cleanup proposal** — separate inventory of unusual backend files; no removal during assessment.
6. **Prioritized actions** — concrete next steps and required approvals.

## Performance/load checks

- Run only against a disposable, isolated environment with synthetic test data; never target production or a shared database.
- Use read-only HTTP `GET` requests so the assessment does not change application data.
- Record the workload profile, environment, p95 request latency, throughput, and failed-request rate.
- The initial profile is 10 virtual users for 30 seconds. Treat its results as a descriptive baseline; do not report pass/fail against an SLO until the owner defines target thresholds.
- A `passed` check means the measurement completed, not that the backend met an unstated performance target. A check that cannot safely run is `blocked` with its cause.

## Finding fields

Each finding includes:

- Stable ID and category.
- Severity: `critical`, `high`, `medium`, `low`, or `not-applicable`.
- Confirmation state.
- Repository-relative location or safe behavioral evidence.
- User or operational impact.
- Reproduction/verification guidance that avoids production systems and data.
- Recommended next action and priority.

Severity follows the definitions in `spec.md`. Findings must not expose secret values, personal data, or sensitive database contents.

## Cleanup candidate fields

Each candidate includes repository-relative path, classification, tracked state, usage/reference checks, regeneration check when relevant, proposed disposition, and approval state. An unverified candidate is `needs-review`; no candidate defaults to removal.

## Integrity rules

- Do not describe a blocked or unrun check as passing.
- Do not describe an unconfirmed risk as a confirmed defect.
- Do not combine a cleanup proposal with a code correction.
- Do not imply the backend is defect-free because no findings were confirmed.
- No cleanup takes place before separate user approval.
