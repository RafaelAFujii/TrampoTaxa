# Quickstart: Revisão da Qualidade do Backend

This guide validates the assessment and the separately approved cleanup plan. It does not authorize production access or deletion of files.

## Prerequisites

- A clean, isolated checkout or disposable worktree; preserve the user's existing worktree changes.
- .NET 8 SDK and the dependencies required by the solution.
- k6 CLI installed separately from the API; see [official Windows installation options](https://grafana.com/docs/k6/latest/set-up/install-k6/). Planning does not install tools.
- A disposable PostgreSQL database for integration tests, isolated from developer and production data.
- A disposable isolated local environment and synthetic dataset for the performance baseline.
- Approval for the cleanup workstream before changing tracked files or `.gitignore`.

## 1. Establish the baseline

From the repository root, record the current status and tracked backend build outputs before making changes:

```powershell
git status --short
git ls-files 'apps/server-dotnet/**/bin/**' 'apps/server-dotnet/**/obj/**'
```

The current planning baseline is 333 tracked paths under `bin/` and `obj/`. Recount before implementation because repository state may change.

## 2. Run the build check

Run in an isolated checkout so build output cannot alter tracked files in the user's working tree:

```powershell
dotnet build apps/server-dotnet/TrampoTaxa.sln
```

Record the exact command, exit result, and relevant error summary. A successful build is not evidence that behavior or security requirements are correct.

## 3. Run integration tests only with a disposable database

`Program.cs` initializes database state at startup, and integration tests write users, gigs, applications, and shifts. Do not run these tests against the default or a shared database.

Set the connection string to a dedicated disposable test database and a temporary signing secret in the current PowerShell session, then run:

```powershell
$env:ConnectionStrings__DefaultConnection = '<dedicated disposable test database connection>'
$env:Jwt__Secret = '<temporary test-only signing secret>'
dotnet test apps/server-dotnet/tests/TrampoTaxa.Api.Tests/TrampoTaxa.Api.Tests.csproj
```

Afterward, remove the temporary environment overrides and discard the test database using the approved local process. If database isolation cannot be confirmed, mark the test check `blocked` and record the reason instead of running it.

## 4. Run the descriptive performance baseline

The load harness at `apps/server-dotnet/tests/performance/baseline.js` sends only `GET /api/gigs`; it does not create or update application records. The API may seed its database at startup, so use a new disposable local database containing only synthetic data. Never use a production or shared database.

In the first PowerShell terminal, configure the API to use that disposable database and a temporary local signing key, then start the API:

```powershell
$env:ConnectionStrings__DefaultConnection = '<disposable local database connection>'
$env:Jwt__Secret = '<temporary local signing key>'
dotnet run --project apps/server-dotnet/src/TrampoTaxa.Api/TrampoTaxa.Api.csproj
```

In a second terminal, run the bounded initial profile:

```powershell
k6 run --vus 10 --duration 30s --env BASE_URL=http://localhost:5286 apps/server-dotnet/tests/performance/baseline.js
```

Record the endpoint set, environment, 10-VU/30-second workload, p95 `http_req_duration`, request throughput (`http_reqs`), and failed-request rate (`http_req_failed`). This is a descriptive baseline only; do not mark it pass/fail against a target that the owner has not defined. If the .NET SDK, k6, or disposable environment is unavailable, mark the check `blocked` and do not run it elsewhere.

## 5. Validate the cleanup proposal after separate approval

Before removing any candidate:

1. Confirm the path is tracked and belongs to the backend scope.
2. Confirm it is generated or otherwise redundant, not a fixture, configuration input, source file, or required documentation.
3. Confirm it can be regenerated or safely omitted.
4. Apply only the approved backend-scoped ignore/removal changes.

After approval and implementation, verify no build-output paths remain tracked:

```powershell
git ls-files 'apps/server-dotnet/**/bin/**' 'apps/server-dotnet/**/obj/**'
```

Re-run the solution build and, only with the isolated test database, the integration test command above. Verify the regenerated build outputs are ignored and the final diff contains only approved cleanup changes.

## Expected outcome

- Every check has a recorded outcome: passed, failed, blocked, or not run.
- A performance baseline, if run, contains the workload/environment and required metrics; it has no pass/fail SLO until targets are agreed.
- Every finding and cleanup candidate follows [the report contract](./contracts/quality-assessment-report.md).
- No production/shared data is accessed, no secret values are included in the report, and no cleanup occurs without separate approval.
