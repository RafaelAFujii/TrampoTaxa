# Contract: Backend Cleanup Proposal

## Purpose

Define a safe, reviewable proposal for cleaning unusual nonfunctional artifacts from the selected backend without changing runtime behavior.

## Initial candidate set

The planning scan found 333 tracked paths under:

- `apps/server-dotnet/**/bin/`
- `apps/server-dotnet/**/obj/`

Treat these as generated-output candidates. Confirm their tracked state, generated nature, regeneration, and lack of fixture/runtime use immediately before cleanup.

## Required review for every candidate

Record:

1. Repository-relative path and tracked/untracked state.
2. Candidate category and evidence for the classification.
3. References from source, tests, configuration, documentation, and build inputs.
4. Whether it is reproducible and how that was verified.
5. Proposed disposition: `proposed-remove`, `retain`, or `needs-review`.
6. Explicit approval state: `pending`, `approved`, or `rejected`.

## Safety constraints

- No deletion or untracking while approval is pending.
- Preserve source, tests, fixtures, required configuration/examples, schema/migration assets, and intentional documentation.
- Do not remove files based only on names such as `bin`, `obj`, `temp`, or `old`.
- Do not touch untracked or unrelated user files.
- Add ignore rules only for the selected backend's confirmed generated output paths; do not broaden them to unrelated workspaces.
- Run the build after the cleanup to confirm generated outputs are recreated and ignored. Run integration tests only against an isolated disposable database.
- Report the exact approved diff and validation results after cleanup.
