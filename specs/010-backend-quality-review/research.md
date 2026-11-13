# Research: Revisão da Qualidade do Backend

**Feature**: [spec.md](./spec.md)
**Date**: 2026-11-12

## Findings and Decisions

### Decision 1: Assess the selected .NET backend without changing its API architecture

- **Decision**: Limit the review to `apps/server-dotnet`, its tests, and directly related configuration and documentation. Do not migrate routes, alter clients, or introduce a new backend.
- **Rationale**: The user selected this backend. The repository constitution identifies the Node/tRPC service as canonical, so the distinction should be reported as an existing architecture risk rather than silently resolved through a code change.
- **Alternatives considered**: Review both backends; migrate the .NET API to tRPC; remove the .NET backend. All exceed the selected scope.
- **Repository evidence**: [apps/server-dotnet/README.md](../../apps/server-dotnet/README.md), [constitution.md](../../.specify/memory/constitution.md).

### Decision 2: Use documented build and test commands, with database-safety gates

- **Decision**: Use the repository's documented `dotnet build` and `dotnet test` commands. Run integration tests only against a verified, disposable database and in an isolated checkout.
- **Rationale**: The API calls `DbInitializer.Seed` during startup, and integration tests create and persist records. The default local connection is therefore not assumed safe for an audit run.
- **Alternatives considered**: Run integration tests against the configured local database; skip all tests. The first is unsafe without isolation; the second loses useful verification when a safe test database is available.
- **Repository evidence**: [apps/server-dotnet/README.md](../../apps/server-dotnet/README.md), [Program.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Program.cs), [DbInitializer.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Data/DbInitializer.cs), [IntegrationTests.cs](../../apps/server-dotnet/tests/TrampoTaxa.Api.Tests/IntegrationTests.cs).

### Decision 3: Make build-output cleanup a separate, approval-gated workstream

- **Decision**: Treat tracked `.NET` build outputs as cleanup candidates; verify they are generated and reproducible, add backend-scoped ignore rules, then remove only approved tracked outputs in a separate implementation step.
- **Rationale**: The repository currently tracks 333 files under the backend's `bin/` and `obj/` directories, while the root `.gitignore` does not define backend-scoped rules for these directories. These are substantial generated-artifact candidates, but removal must not be inferred solely from directory names.
- **Alternatives considered**: Delete all files named `bin`/`obj` immediately; ignore every such directory across the repository; leave tracked outputs untouched. Immediate deletion is not safe, broad ignore rules exceed scope, and leaving confirmed build outputs tracked fails the requested cleanup plan.
- **Repository evidence**: `git ls-files 'apps/server-dotnet/**/bin/**' 'apps/server-dotnet/**/obj/**'` returned 333 paths; [`.gitignore`](../../.gitignore); [apps/server-dotnet/TrampoTaxa.sln](../../apps/server-dotnet/TrampoTaxa.sln).

### Decision 4: Report findings and cleanup candidates separately

- **Decision**: Use one assessment report with separate sections for confirmed defects, risks, limitations, and cleanup candidates. No cleanup candidate is removed during assessment.
- **Rationale**: A generated artifact, a code defect, and an unverified risk require different evidence and decisions. Keeping their dispositions separate prevents cleanup from obscuring quality findings.
- **Alternatives considered**: Combine all observations into one unclassified list; make cleanup part of the read-only audit. Both reduce traceability or violate the audit-only boundary.

### Decision 5: Add no application packages or runtime services

- **Decision**: Do not add a package or service to the API or its NuGet test project. The performance baseline uses the separate k6 CLI as documented in Decision 6.
- **Rationale**: The feature adds a test-only HTTP harness, not a runtime capability. Keeping k6 external avoids coupling the API/test assembly to a load-test library.
- **Alternatives considered**: Add a .NET load-testing package to the project; rejected because the baseline is HTTP-only and a separate CLI is sufficient.

### Decision 6: Use k6 as a separate, local load-test harness

- **Decision**: Use k6 for one bounded baseline profile: 10 virtual users for 30 seconds, exercising only read-only `GET /api/gigs` against the disposable local API and database. Record the workload profile, p95 request duration, request throughput, and failed-request rate. Treat results as descriptive baseline data, not pass/fail, until the owner defines target thresholds.
- **Rationale**: The repository has no configured load-test harness, and k6 is not installed in the current environment. k6 runs separately from the .NET application, has Windows installation options, supports a constant-VU profile, and reports the HTTP duration, request-count, and failed-request metrics needed by the specification. It adds no NuGet dependency or production runtime code.
- **Alternatives considered**: A `curl` loop is already available but does not provide the required percentile and rate summary as a repeatable load profile. A .NET-integrated tool such as NBomber would couple the baseline harness to the app's package/test stack without a demonstrated benefit for this HTTP-only assessment.
- **Safety constraints**: Do not run against production or shared services/data. The API startup seeding behavior means the environment must be disposable and isolated. The load script sends GET requests only. Do not install k6 or run the test during planning.
- **Official references**: [k6 built-in metrics](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/), [Windows installation](https://grafana.com/docs/k6/latest/set-up/install-k6/), [constant-VU executor](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-vus/).

## Research Completion

The technical context and load-harness choice are resolved from the repository, user clarifications, and official k6 documentation. k6 remains an external test-only tool, not an application dependency. No runtime tests or package installations were performed during planning.
