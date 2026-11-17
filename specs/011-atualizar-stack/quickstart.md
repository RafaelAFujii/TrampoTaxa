# Quickstart: Validar a Atualização Tecnológica

This guide is for the implementation phase. Use the exact stable versions recorded in `docs/technology-upgrade-inventory.md`; recheck vendor support and compatibility on the day of the upgrade.

## Prerequisites and safety

- Use the explicitly pinned Bun and Node.js versions recorded by the upgrade.
- Install the supported .NET SDK selected for the API.
- For backend integration tests, use only a disposable PostgreSQL instance dedicated to this run. The API initializes/seeds its configured database at startup; never use a production or shared database.
- Do not update PostgreSQL/SQL Server service versions, production data, or hosting infrastructure as part of this validation.
- Use Expo's matching React/React Native/native-module versions for each SDK step. Do not jump across SDK releases in one unreviewed change.

## JavaScript monorepo

From the repository root, install from the committed lockfile:

```powershell
bun install --frozen-lockfile
```

Run the existing workspace checks:

```powershell
bun test
bun run --filter web test
bun run --filter web lint
bun run --filter web build
bun run --filter mobile test
bun run --filter mobile typecheck
bun run --filter @trampotaxa/shared test
bun audit --audit-level=high
```

Also run the Bun server package tests with `bun run --filter @trampotaxa/server test`.

Do not run REST/OpenAPI client generators (including Orval); this conflicts with the tRPC-only architecture. Confirm that this upgrade does not change `packages/shared/src/api`. Review all lockfile and manifest changes; a frozen install must succeed from a clean checkout.

## Mobile SDK migration and validation

For each SDK step, from `apps/mobile`, reconcile the dependency set using the SDK's supported matrix and then run Expo diagnostics:

```powershell
bunx expo install --fix
bunx expo-doctor
bunx expo config --type public
bunx expo export --platform android
bunx expo export --platform ios
```

`expo install --fix` is an upgrade step that can modify the mobile manifest; review those changes and regenerate the root lockfile before validation. Keep `apps/mobile/metro.config.js` workspace mappings intact. A JavaScript export is not a substitute for a native device/build check; complete the supported preview/native build checks configured for the project before release, and record any unavailable target as blocked rather than passed.

## .NET API

The root `global.json` selects .NET SDK 11 and Microsoft.Testing.Platform for xUnit v3. Use the `--project` form for `dotnet test`. Run NuGet inventory commands in a disposable checkout because package restore updates tracked legacy `obj/` artifacts.

```powershell
dotnet package list --project apps/server-dotnet/TrampoTaxa.sln --outdated
dotnet package list --project apps/server-dotnet/TrampoTaxa.sln --deprecated
dotnet package list --project apps/server-dotnet/TrampoTaxa.sln --vulnerable --include-transitive
$artifacts = Join-Path $env:TEMP 'trampotaxa-spec11-artifacts'
dotnet build apps/server-dotnet/TrampoTaxa.sln --artifacts-path $artifacts
dotnet test --project apps/server-dotnet/tests/TrampoTaxa.Api.Tests/TrampoTaxa.Api.Tests.csproj --artifacts-path $artifacts
```

Before `dotnet test`, set `ConnectionStrings__DefaultConnection` to the disposable test database only. The CI path must provide an isolated PostgreSQL service and a test-only connection string. Remove the local environment override after testing. No result from a test run against the default/shared database is acceptable evidence.

## Completion review

1. Run all required CI workflows after the changes.
2. Verify each inventory entry has an official source, support status, target version, and applicable validation evidence.
3. Ensure no high/critical advisory introduced by the upgrade remains unresolved; any exception must satisfy the inventory contract.
4. Confirm essential web, mobile, and backend flows pass, the data schema and external service versions are unchanged, and docs reflect the selected versions.
5. Record every command as passed, failed, blocked, or not-run. A missing tool, target, or test environment is not a pass.

## Expected outcome

- `bun install --frozen-lockfile`, all applicable workspace checks, and the .NET build/tests succeed.
- Expo reports no unresolved SDK/dependency compatibility problem, and platform-specific bundles/build checks complete.
- No unsupported technology remains without a documented, approved exception.
- The technology inventory accurately reflects the verified result and required follow-up.
