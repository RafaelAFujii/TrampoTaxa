# Contract: Technology Upgrade Inventory

## Purpose

Define the single maintained record that proves which technologies were evaluated, which versions were selected, and whether required verification passed. This is a repository maintenance artifact; it does not change application APIs or persisted product data.

## Location and format

The implementation maintains one concise Markdown inventory at `docs/technology-upgrade-inventory.md`. The format may use one table for technology entries and a separate table for approved exceptions; verification evidence can link to CI runs or documented commands.

## Required technology-entry fields

Every in-scope direct dependency, runtime, framework, build/test tool, CI action, and delivery tool has:

1. Workspace and component name.
2. Role/category.
3. Current declared and resolved versions where applicable.
4. Selected stable target version.
5. Support state at the recorded review date, with an official source.
6. Compatibility constraint or an explicit indication that none was identified.
7. Verification status/evidence for affected workspaces.
8. Outcome: `pending`, `updated-verified`, `exception`, or `blocked`.

The committed lockfile/restore assets are the record for transitive package resolution. List transitive packages individually only when required to explain a support or security exception.

## Exception contract

An exception is acceptable only when it names the component, reason, risk, owner, due date, approver, approval date, and mitigation when risk is material. An unreviewed, unsupported, or unknown item is `blocked`, not an approved exception.

## Completion rules

- Targets must be stable, officially supported, and confirmed against a source current at implementation time.
- Mobile React/React Native/Expo package versions must match the selected Expo SDK compatibility matrix.
- Architecture-mandated versions and behavior remain in force unless a separate approved Constitution change updates them.
- Required checks must pass. A blocked or unrun check cannot be represented as passed.
- No production/shared database, external managed database engine, or user data is modified by this inventory.
