<!--
Sync Impact Report
Version change: unversioned scaffold to 1.0.0
Modified principles: scaffold placeholders → five project-specific principles
Added sections: Architecture and Security Constraints; Development and Release Workflow
Removed sections: none
Follow-up TODOs: record the original ratification date when confirmed
-->

# TrampoTaxa Constitution

## Core Principles

### I. TypeScript for All Application Logic
All handwritten application logic across Web, Mobile, and shared packages MUST be
implemented in TypeScript. This includes business rules, validation, state transitions,
and integration behavior. Declarative configuration and generated artifacts are not
application logic. This rule keeps behavior consistently type-checked across the
monorepo.

### II. Platform Architecture
The Web application MUST follow the ReactJS and Vite architecture. The Mobile
application MUST use React Native. Code shared between platforms MUST live in shared
packages and remain platform-independent; platform-specific behavior MUST stay within
its respective application. This preserves native platform boundaries while enabling
reuse.

### III. Authenticated and Authorized Access
Authenticated application access MUST use JWT-based authentication managed through
`AuthContext`. Protected capabilities MUST enforce role-based access control (RBAC),
and account flows MUST explicitly handle first access. Authentication and authorization
MUST be enforced at each relevant application boundary; hiding a user interface element
alone does not constitute access control.

### IV. Test-First Development
Changes to application behavior MUST follow the TDD red-green-refactor cycle, with
Vitest tests written or updated before implementation. The relevant tests MUST fail
for the intended reason before the behavior is implemented, then pass after the change.
This makes expected behavior reproducible and guards against regressions.

### V. Measurable Quality and Safe Delivery
ESLint and SonarLint MUST both be used to monitor code quality, and the technical-debt
measure reported for each tool MUST remain strictly below 10%. A change that causes
either measure to reach or exceed 10% MUST be corrected before release. Every deployment
to GitHub Pages MUST be preceded by a passing GitHub Actions pipeline, including the
applicable Vitest suite. No deployment may proceed when that pipeline fails.

## Architecture and Security Constraints

- Web user experiences MUST use ReactJS with Vite; mobile user experiences MUST use
  React Native.
- Application logic MUST be TypeScript throughout Web, Mobile, and shared packages.
- JWT authentication MUST be integrated through `AuthContext`; protected actions and
  routes MUST apply RBAC, including the first-access flow.
- Security-sensitive authorization decisions MUST not rely solely on client-side
  presentation or navigation restrictions.

## Development and Release Workflow

- Contributors MUST write or update Vitest tests before changing application behavior
  and verify the red-green-refactor sequence.
- Changes MUST pass the applicable test suite and GitHub Actions checks before release.
- Each GitHub Pages deployment MUST be triggered only after the relevant GitHub Actions
  pipeline has completed successfully.
- ESLint and SonarLint findings MUST be reviewed as part of quality checks, and each
  tool's reported technical-debt measure MUST be strictly less than 10%.

## Governance

This constitution defines mandatory project-wide engineering constraints. Amendments
MUST be proposed through a reviewed change that explains the rationale and impact on
existing principles, architecture, security, tests, and delivery practices. The project
maintainers MUST review compliance in code review and before releases. Exceptions MUST
be documented with their scope, rationale, approving maintainer, and expiration or
removal condition.

The constitution uses semantic versioning: MAJOR for incompatible governance changes or
removal/redefinition of a principle; MINOR for new principles or materially expanded
requirements; PATCH for clarifications and non-semantic wording changes. Every amendment
MUST update the version, last-amended date, and impact report. Reviewers MUST verify that
changes and releases comply with this constitution; non-compliance blocks approval or
deployment until corrected or covered by an approved, time-bounded exception.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original ratification date is not documented | **Last Amended**: 2026-10-15
