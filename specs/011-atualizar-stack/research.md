# Research: Atualização da Stack Tecnológica

**Research date**: 2026-11-12

Version targets are time-sensitive. Recheck official stable releases, support phases, and compatibility matrices when implementation begins; do not treat this snapshot as a permanent version pin.

## Decision: Use vendor-supported stable releases and compatibility matrices

**Decision**: For each in-scope component, select the latest stable release that is officially supported at implementation time. Exclude previews. For coupled frameworks and native modules, use the framework's published compatibility matrix rather than independently selecting each package. Record the target, source, and support phase in the inventory.

**Rationale**: The request is to avoid deprecated technology, and the specification requires both the latest supported stable release and explicit exceptions when compatibility blocks an upgrade.

**Alternatives considered**:

- Upgrade only packages with known security advisories: rejected because it would leave unsupported technologies in place.
- Set one fixed target version for the whole repository: rejected because each ecosystem has its own release cadence and compatibility rules.
- Use prerelease versions to stay ahead: rejected because the specification excludes preview releases.

## Decision: Upgrade Expo and React Native together, one SDK at a time

**Decision**: Treat Expo as the authority for the mobile compatibility set. Upgrade sequentially by SDK release, following each release's migration notes; align React, React Native, Expo modules, and native dependencies for each step. Run Expo's supported dependency correction and diagnostic checks and preserve the monorepo Metro configuration.

**Rationale**: The repository starts at Expo SDK 51 / React Native 0.74. Expo recommends incremental SDK upgrades, installing SDK-compatible packages, running Expo Doctor, and following release notes. On the research date, Expo's latest reference is SDK 58 and React Native's latest documentation is 0.88; those independent latest labels do not establish that the versions are a compatible pair. The SDK matrix is authoritative.

**Alternatives considered**:

- Jump directly from SDK 51 to the latest SDK: rejected because it makes breaking changes harder to isolate and diagnose.
- Pick the latest React Native independently of Expo: rejected because native module and Expo SDK compatibility must be maintained.

**Official sources**:

- [Expo SDK upgrade guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
- [Expo SDK latest reference](https://docs.expo.dev/versions/latest/)
- [React Native documentation versions](https://reactnative.dev/versions)

## Decision: Move the .NET API off .NET 8 and use the latest supported stable target

**Decision**: At implementation time, target the latest stable supported .NET release and align the ASP.NET Core, EF Core/Npgsql provider, authentication, OpenAPI, and test packages. As of the research date, Microsoft's support policy lists .NET 11 as active STS and .NET 10 as active LTS; .NET 8 reached end of support on 2026-11-10. The specification's "latest stable" policy points to .NET 11 unless a verified hosting/provider constraint requires an approved exception.

**Rationale**: Remaining on .NET 8 would leave the backend on an unsupported runtime. Microsoft's upgrade guidance recommends assessing dependencies, choosing a migration path, reviewing breaking changes, and validating the upgraded application. The repository's integration tests write data, so all test runs must use an isolated disposable database.

**Alternatives considered**:

- Remain on .NET 8 and apply only patches: rejected because .NET 8 is out of support.
- Prefer .NET 10 LTS without considering .NET 11: not selected by default because the user requested the latest stable version; consider it only if the owner chooses a longer LTS support preference or a verified compatibility constraint warrants an exception.

**Official sources**:

- [.NET and .NET Core support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core)
- [Upgrade .NET apps overview](https://learn.microsoft.com/en-us/dotnet/core/porting/)
- [.NET breaking changes](https://learn.microsoft.com/en-us/dotnet/core/compatibility/)

## Decision: Make the Bun workspace lockfile and CI versions reproducible

**Decision**: Keep `bun.lock` committed, align its resolution with all workspace manifests, and require frozen-lockfile installs in validation. Select one supported stable Bun version and use the same explicit version in CI and contributor instructions; choose a Node.js version supported by the selected Expo SDK and pin it consistently. Upgrade CI actions to current supported stable releases only after checking their migration notes.

**Rationale**: The repository has several workspaces and duplicated dependencies declared at the root and within apps. CI currently uses a floating Bun `latest`, while the package manager lockfile is the reproducible dependency resolution record. Workspace ownership and hoisting must be considered when aligning versions.

**Alternatives considered**:

- Leave CI on floating `latest`: rejected because the toolchain can change without a repository update.
- Edit package manifests without regenerating and validating the lockfile: rejected because clean installs must be reproducible.
- Force every package to one version regardless of peer constraints: rejected because the mobile framework and other packages have compatibility-specific version requirements.

**Official sources**:

- [Bun workspaces](https://bun.sh/docs/pm/workspaces)
- [Bun lockfile](https://bun.sh/docs/pm/lockfile)
- [Bun package manager CLI](https://bun.sh/docs/pm/cli)

## Repository baseline and compatibility constraints

- The root manifest and web/mobile/server/shared workspaces declare overlapping packages with version differences. The root manifest currently uses tRPC v11 and Zod v4, while `apps/server` declares tRPC v10 and Zod v3.
- The mobile app currently uses Expo SDK 51, React 18.2, React Native 0.74, and React Navigation 6. The root and web workspaces declare newer/different versions of several shared packages.
- The .NET API and integration tests target `net8.0`. The projects directly reference .NET 8-era ASP.NET Core, EF Core/Npgsql, Swagger, and xUnit packages.
- GitHub Actions use Node.js 24 and floating `latest` values for Bun and EAS. The existing quality workflow validates JavaScript workspaces but omits .NET build/tests.
- The Constitution's architectural requirements remain binding: tRPC v11, TanStack Query v5, Zustand, shared business logic, Metro workspace resolution, strict typing, and fail-closed authorization. Only version declarations may be updated; architectural principles are not weakened.
- PostgreSQL/SQL Server service versions, production data, schema migrations, and hosting infrastructure are not upgrade targets. Driver/provider compatibility is in scope.

