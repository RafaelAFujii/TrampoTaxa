# Technology Upgrade Inventory

**Review date:** 2026-11-13  
**Feature:** `specs/011-atualizar-stack/`  
**Status:** Upgrade implemented; final acceptance is blocked by production-bundle fixture checks and unavailable disposable PostgreSQL integration testing.

## Selection policy

- Runtime and framework targets use current vendor support and compatibility documentation.
- npm targets use the stable `latest` registry tag as of the review date. Most community packages do not publish a formal support lifecycle; that limitation is explicit and deprecation/advisory checks remain required.
- Expo-managed mobile package versions are provisional until reconciled with SDK 58 using `expo install --fix` and Expo Doctor.
- `workspace:*` links are internal packages, not external technology targets.
- The original resolved versions below were read from the committed Bun lock/install and NuGet restore assets before changes.

## Runtime, framework, and delivery targets

| Workspace | Component | Current declared / resolved | Target | Support evidence and compatibility | Verification / outcome |
|---|---|---|---|---|---|
| CI / local | Node.js | CI `24`; local `22.16.0` | `26.13.1` | [Node release schedule](https://nodejs.org/en/about/previous-releases): v26 is LTS. Required by current Expo/RN package engines. | CI pinned; local runtime remains 22.16.0 |
| CI / local | Bun | CI `latest`; local `1.4.3` | `1.4.4` | [Bun stable release](https://github.com/oven-sh/bun/releases/tag/bun-v1.4.4). | Frozen install passed with Bun 1.4.4; stale-linker cleanup emitted a non-fatal EPERM warning |
| Mobile CI | EAS CLI | `latest` | `27.9.0` | [EAS CLI release](https://github.com/expo/eas-cli/releases/tag/v27.9.0). | CI pinned; no native EAS build was run |
| Mobile | Expo SDK | `~51.0.0` / `51.0.39` | `58.0.25` | [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/) and [incremental upgrade guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/). | Expo Doctor 20/20; public config and Android/iOS exports passed |
| Mobile | React Native | `0.74.1` | `0.88.1` | Expo SDK 58 specifies React Native 0.88; [React Native version index](https://reactnative.dev/versions). | Expo Doctor 20/20; mobile typecheck and Android/iOS exports passed |
| Web / mobile | React | Web `^19.0.1` / `19.3.0`; mobile `18.2.0` | `19.3.0` | Expo SDK 58's official compatibility installer requires React `19.3.0`; keep web/mobile/shared on this version to avoid duplicate React in the monorepo. | Expo Doctor 20/20; web build and mobile typecheck passed |
| Web | Vite | `^8.3.0` / `8.3.1` | `8.3.8` | [Vite npm registry](https://www.npmjs.com/package/vite), stable release. | Frozen lock verified; see validation summary below |
| Web | Tailwind CSS | `^4.3.3` / `4.3.3` | `4.3.5` | [Tailwind CSS npm registry](https://www.npmjs.com/package/tailwindcss), stable release. | Frozen lock verified; see validation summary below |
| Web / mobile | TypeScript | Web `^5.8.2` / `5.9.3`; mobile same range / `5.9.3` | `6.0.3` | [TypeScript npm registry](https://www.npmjs.com/package/typescript). Version 7 is not selected because `typescript-eslint@8.72.2` declares support only below 6.1. | Web lint/typecheck and mobile typecheck passed |
| .NET API / tests | .NET SDK and target framework | `net8.0`; no SDK installed initially | `11.0.100` / `net11.0` | [Microsoft support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core): .NET 11 active STS; .NET 8 ended support 2026-11-10. SDK installed in the user profile for validation. | Solution build passed with 0 warnings/errors; 5 tests discovered; integration execution blocked |
| .NET API | PostgreSQL service | PostgreSQL 15 | PostgreSQL 15 test service | Database engine is unchanged; CI tests use a disposable PostgreSQL 15 service and a test-only connection string. | CI service configured; no local PostgreSQL service or available Docker daemon |

## JavaScript and TypeScript direct dependencies

For registry links below, “latest stable” means the npm `latest` distribution tag observed on the review date. Community-package publishers generally do not provide a separate support lifecycle. Entries are locked to the selected targets; workspace validation outcomes and exceptions are summarized at the end of this inventory.

| Workspace declarations (declared / resolved) | Component | Target | Compatibility note | Verification / outcome |
|---|---|---|---|---|
| root `^7.20.0` / `7.20.0`; mobile `^6.6.1` / `6.6.1` | [@react-navigation/bottom-tabs](https://www.npmjs.com/package/@react-navigation/bottom-tabs) | `7.21.0` | Mobile aligns with Navigation 7 and SDK 58. | Frozen lock verified; see validation summary below |
| root `^7.5.0` / `7.5.0`; mobile `^6.1.18` / `6.1.18` | [@react-navigation/native](https://www.npmjs.com/package/@react-navigation/native) | `7.5.1` | Mobile aligns with Navigation 7. | Frozen lock verified; see validation summary below |
| root `^5.104.2` / `5.104.2`; web and mobile `^5.67.2` / `5.104.2` | [@tanstack/react-query](https://www.npmjs.com/package/@tanstack/react-query) | `5.107.1` | Preserve required v5 architecture. | Frozen lock verified; see validation summary below |
| root `^11.25.2` / `11.25.2`; server `^10.45.2` / `10.45.4` | [@trpc/server](https://www.npmjs.com/package/@trpc/server) | `11.28.0` | Server must align with the Constitution's tRPC v11 requirement. | Frozen lock verified; see validation summary below |
| root `^12.3.0` / `12.3.0`; server `^9.0.6` / `9.1.11` | [@types/mssql](https://www.npmjs.com/package/@types/mssql) | `12.3.0` | Align declarations with `mssql` v12. | Frozen lock verified; see validation summary below |
| root and server `^0.45.4` / `0.45.4` | [drizzle-orm](https://www.npmjs.com/package/drizzle-orm) | `0.45.4` | Already at latest stable registry version. | Frozen lock verified; see validation summary below |
| root `^12.7.14` / `12.7.14`; server `^11.0.1` / `11.0.2` | [mssql](https://www.npmjs.com/package/mssql) | `12.7.14` | Keep both workspaces on the same driver major. | Frozen lock verified; see validation summary below |
| root `^1.29.11` / `1.29.11`; mobile `1.14.0` / `1.14.0` | [react-native-maps](https://www.npmjs.com/package/react-native-maps) | `1.29.11` | Mobile version must also pass Expo SDK 58 compatibility checks. | Frozen lock verified; see validation summary below |
| root `^5.10.1` / `5.10.1`; mobile `4.10.5` / `4.10.5` | [react-native-safe-area-context](https://www.npmjs.com/package/react-native-safe-area-context) | `5.11.1` | Provisional; Expo compatibility matrix is authoritative. | Frozen lock verified; see validation summary below |
| root `^4.30.0` / `4.30.0`; mobile `~3.31.1` / `3.31.1` | [react-native-screens](https://www.npmjs.com/package/react-native-screens) | `4.30.1` | Provisional; Expo compatibility matrix is authoritative. | Frozen lock verified; see validation summary below |
| root and web `^9.1.0` / `9.1.0` | [supercluster](https://www.npmjs.com/package/supercluster) | `9.1.0` | Already at latest stable registry version. | Frozen lock verified; see validation summary below |
| root and web `^1.2.0` / `1.2.0` | [use-supercluster](https://www.npmjs.com/package/use-supercluster) | `1.2.0` | Already at latest stable registry version. | Frozen lock verified; see validation summary below |
| root `^7.4.1` / `7.4.1`; web `^7.3.0` / `7.4.1` | [workbox-window](https://www.npmjs.com/package/workbox-window) | `7.4.1` | Keep aligned with Vite PWA tooling. | Frozen lock verified; see validation summary below |
| root `^4.6.7` / `4.6.7`; server `^3.24.2` / `3.25.76` | [zod](https://www.npmjs.com/package/zod) | `4.6.7` | Server migration to Zod 4 is coupled with tRPC 11. | Frozen lock verified; see validation summary below |
| root `^5.1.0` / `5.1.0`; web, mobile, shared `^5.0.3` / `5.1.0` | [zustand](https://www.npmjs.com/package/zustand) | `5.1.0` | Preserve required global-state architecture. | Frozen lock verified; see validation summary below |
| root `^1.4.4` / `1.4.4` | [@types/bun](https://www.npmjs.com/package/@types/bun) | `1.4.4` | Align type declarations with pinned Bun. | Frozen lock verified; see validation summary below |
| root and web `^7946.0.16` / `7946.0.16` | [@types/geojson](https://www.npmjs.com/package/@types/geojson) | `7946.0.16` | Already at latest stable registry version. | Frozen lock verified; see validation summary below |
| root and web `^7.1.3` / `7.1.3` | [@types/supercluster](https://www.npmjs.com/package/@types/supercluster) | `7.1.3` | Already at latest stable registry version. | Frozen lock verified; see validation summary below |
| root `^6.3.0` / `6.3.0` | [gh-pages](https://www.npmjs.com/package/gh-pages) | `6.3.0` | Already at latest stable registry version. | Frozen lock verified; see validation summary below |
| root, web, shared `^3.9.10` / `3.9.10` | [prettier](https://www.npmjs.com/package/prettier) | `3.10.1` | Keep workspace formatter versions aligned. | Frozen lock verified; see validation summary below |
| web `^2.4.0` / `2.24.0` | [@google/genai](https://www.npmjs.com/package/@google/genai) | `3.3.0` | Major upgrade; validate any affected build/runtime references. | Frozen lock verified; see validation summary below |
| web `^4.3.3` / `4.3.3` | [@tailwindcss/vite](https://www.npmjs.com/package/@tailwindcss/vite) | `4.3.5` | Align with Tailwind CSS v4. | Frozen lock verified; see validation summary below |
| web `^1.10.1` / `1.10.1` | [@vis.gl/react-google-maps](https://www.npmjs.com/package/@vis.gl/react-google-maps) | `1.10.2` | Stable patch update. | Frozen lock verified; see validation summary below |
| web `^6.1.1` / `6.1.1` | [@vitejs/plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react) | `6.3.0` | Requires Vite 8; selected target satisfies that peer range. | Frozen lock verified; see validation summary below |
| web `^17.2.3` / `17.4.2` | [dotenv](https://www.npmjs.com/package/dotenv) | `18.0.10` | Major upgrade. | Frozen lock verified; see validation summary below |
| web `^4.21.2` / `4.22.3` | [express](https://www.npmjs.com/package/express) | `5.3.0` | Major upgrade; align `@types/express`. | Frozen lock verified; see validation summary below |
| web `^0.546.0` / `0.546.0` | [lucide-react](https://www.npmjs.com/package/lucide-react) | `1.72.0` | Major upgrade; verify existing icon exports at build. | Frozen lock verified; see validation summary below |
| web `^12.23.24` / `12.43.0` | [motion](https://www.npmjs.com/package/motion) | `14.13.0` | Major upgrade. | Frozen lock verified; see validation summary below |
| web `^19.0.1` / `19.3.0`; mobile `18.2.0` / `18.2.0`; shared peer `>=18.0.0` / `19.3.0` | [react](https://www.npmjs.com/package/react) | `19.3.0` | Expo SDK 58's compatibility installer selects `19.3.0`; using the registry's newer `19.3.1` would diverge from the SDK matrix. | Locked with Expo SDK 58 |
| web `^19.0.1` / `19.3.0`; shared peer `>=18.0.0` / `19.3.0` | [react-dom](https://www.npmjs.com/package/react-dom) | `19.3.0` | Keep aligned with React and the shared workspace. | Frozen lock verified; see validation summary below |
| web `^7.18.4` / `7.18.4` | [react-router-dom](https://www.npmjs.com/package/react-router-dom) | `7.18.5` | Stable patch update. | Frozen lock verified; see validation summary below |
| web `^8.3.0` / `8.3.1` | [vite](https://www.npmjs.com/package/vite) | `8.3.8` | Stable patch update. | Frozen lock verified; see validation summary below |
| web `^4.17.21` / `4.17.25` | [@types/express](https://www.npmjs.com/package/@types/express) | `5.0.6` | Match Express 5. | Frozen lock verified; see validation summary below |
| web `^3.66.4` / `3.66.4` | [@types/google.maps](https://www.npmjs.com/package/@types/google.maps) | `3.66.10` | Stable patch update. | Frozen lock verified; see validation summary below |
| web `^22.14.0` / `22.20.4`; mobile `^26.6.5` / `26.6.6` | [@types/node](https://www.npmjs.com/package/@types/node) | `26.6.6` | Match Node 26. | Frozen lock verified; see validation summary below |
| web `^19.3.0` / `19.3.0`; mobile `~18.2.79` / `18.2.79` | [@types/react](https://www.npmjs.com/package/@types/react) | `19.3.0` | Align mobile with React 19 / SDK 58. | Frozen lock verified; see validation summary below |
| web `^19.3.0` / `19.3.0` | [@types/react-dom](https://www.npmjs.com/package/@types/react-dom) | `19.3.0` | Already at latest stable registry version. | Frozen lock verified; see validation summary below |
| web `^10.4.21` / `10.6.1` | [autoprefixer](https://www.npmjs.com/package/autoprefixer) | `10.6.2` | Stable patch update. | Frozen lock verified; see validation summary below |
| web `^0.28.2` / `0.28.2` | [esbuild](https://www.npmjs.com/package/esbuild) | `0.28.2` | Already at latest stable registry version. | Frozen lock verified; see validation summary below |
| web `^10.12.0` / `10.12.0` | [eslint](https://www.npmjs.com/package/eslint) | `10.14.0` | Compatible with `typescript-eslint@8.72.2`. | Frozen lock verified; see validation summary below |
| web `^0.13.0` / `0.13.0` | [install](https://www.npmjs.com/package/install) | `0.13.0` | Already at latest stable registry version. | Frozen lock verified; see validation summary below |
| web `^4.3.3` / `4.3.3` | [tailwindcss](https://www.npmjs.com/package/tailwindcss) | `4.3.5` | Align with Tailwind Vite plugin. | Frozen lock verified; see validation summary below |
| web `^4.21.0` / `4.23.15` | [tsx](https://www.npmjs.com/package/tsx) | `4.23.15` | Already at latest stable registry version. | Frozen lock verified; see validation summary below |
| web `^5.8.2` / `5.9.3`; mobile same declaration / `5.9.3` | [typescript](https://www.npmjs.com/package/typescript) | `6.0.3` | Highest stable version compatible with `typescript-eslint@8.72.2` peer range (`<6.1.0`). | Frozen lock verified; see validation summary below |
| web `^8.71.1` / `8.71.1` | [typescript-eslint](https://www.npmjs.com/package/typescript-eslint) | `8.72.2` | Peer range supports TypeScript below 6.1. | Frozen lock verified; see validation summary below |
| web `^2.0.0` / `2.0.0` | [vite-plugin-pwa](https://www.npmjs.com/package/vite-plugin-pwa) | `2.0.0` | Already at latest stable registry version; requires Vite 8 / Workbox 7.4.1. | Frozen lock verified; see validation summary below |
| web, mobile, shared `^5.0.3` / `5.0.3` | [vitest](https://www.npmjs.com/package/vitest) | `5.1.0` | Compatible with Vite 8 and Node 26. | Frozen lock verified; see validation summary below |
| mobile `^7.24.0` / `7.29.10` | [@babel/runtime](https://www.npmjs.com/package/@babel/runtime) | `7.29.14` | Stay on Babel 7, as Expo SDK 58's Babel preset depends on that major. | Frozen lock verified; see validation summary below |
| mobile `0.74.83` / `0.74.83` | [@react-native/assets-registry](https://www.npmjs.com/package/@react-native/assets-registry) | `0.88.1` | Must match React Native 0.88 / Expo SDK 58. | Frozen lock verified; see validation summary below |
| mobile `~10.0.10` / `10.0.10` | [expo-asset](https://www.npmjs.com/package/expo-asset) | `58.0.21` | Confirmed by Expo SDK 58 compatibility checks. | Expo Doctor 20/20 |
| mobile `~13.0.2` / `13.0.2` | [expo-secure-store](https://www.npmjs.com/package/expo-secure-store) | `58.0.3` | Confirmed by Expo SDK 58 compatibility checks. | Expo Doctor 20/20 |
| mobile `~1.12.1` / `1.12.1` | [expo-status-bar](https://www.npmjs.com/package/expo-status-bar) | `58.0.5` | Confirmed by Expo SDK 58 compatibility checks. | Expo Doctor 20/20 |
| mobile `13.8.6` / `13.8.6` | [react-native-webview](https://www.npmjs.com/package/react-native-webview) | `14.0.1` | Confirmed by Expo SDK 58 compatibility checks. | Expo Doctor 20/20 |
| mobile `^7.20.0` / `7.20.0` | [@babel/core](https://www.npmjs.com/package/@babel/core) | `7.29.13` | Stay on Babel 7 for Expo preset compatibility. | Frozen lock verified; see validation summary below |
| mobile `^26.6.5` / `26.6.6` | [@types/node](https://www.npmjs.com/package/@types/node) | `26.6.6` | Already at latest stable registry version. | Frozen lock verified; see validation summary below |
| shared `^2.8.1` / `2.9.1` | [yaml](https://www.npmjs.com/package/yaml) | `2.9.1` | Already at latest stable registry version. | Frozen lock verified; see validation summary below |

## .NET direct package targets

The Npgsql provider's latest stable release is 10.0.3 and declares EF Core 10.0.4 as its compatible dependency line; the available 11.0.0 provider versions are prereleases and are excluded. The .NET 11 solution build passes with this combination; integration compatibility remains unverified because no disposable local PostgreSQL service was available. PostgreSQL remains version 15.

| Project | Component | Current declared / resolved | Target | Support evidence / compatibility | Verification / outcome |
|---|---|---|---|---|---|
| API | BCrypt.Net-Next | `4.0.3` / `4.0.3` | `4.2.1` | [NuGet](https://www.nuget.org/packages/BCrypt.Net-Next); latest stable. | No newer, deprecated, or vulnerable package reported; solution build passed |
| API | Microsoft.AspNetCore.Authentication.JwtBearer | `8.0.8` / `8.0.8` | `11.0.0` | [NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.JwtBearer); align with .NET 11. | No newer, deprecated, or vulnerable package reported; solution build passed |
| API | Microsoft.AspNetCore.OpenApi | `8.0.34` / `8.0.34` | `11.0.0` | [NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.OpenApi); align with .NET 11. | No newer, deprecated, or vulnerable package reported; solution build passed |
| API | Npgsql.EntityFrameworkCore.PostgreSQL | `8.0.4` / `8.0.4` | `10.0.3` | [NuGet](https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL); latest stable provider; requires EF Core 10.0.4. | No newer, deprecated, or vulnerable package reported; build passed; DB integration blocked |
| API | Swashbuckle.AspNetCore | `6.6.2` / `6.6.2` | `11.0.1` | [NuGet](https://www.nuget.org/packages/Swashbuckle.AspNetCore); latest stable. | No newer, deprecated, or vulnerable package reported; solution build passed |
| Tests | coverlet.collector | `6.0.0` / `6.0.0` | `10.1.0` | [NuGet](https://www.nuget.org/packages/coverlet.collector); latest stable. | No newer, deprecated, or vulnerable package reported; solution build passed |
| Tests | Microsoft.AspNetCore.Mvc.Testing | `8.0.8` / `8.0.8` | `11.0.0` | [NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.Testing); align with .NET 11. | No newer, deprecated, or vulnerable package reported; solution build passed |
| Tests | Microsoft.NET.Test.Sdk | `17.8.0` / `17.8.0` | `18.12.0` | [NuGet](https://www.nuget.org/packages/Microsoft.NET.Test.Sdk); latest stable. | No newer, deprecated, or vulnerable package reported; MTP test discovery passed |
| Tests | xunit | `2.5.3` / `2.5.3` | `xunit.v3` `4.0.3` | [NuGet](https://www.nuget.org/packages/xunit.v3); replace the legacy, deprecated xUnit v2 package. | No newer, deprecated, or vulnerable package reported; 5 tests discovered |
| Tests | xunit.runner.visualstudio | `2.5.3` / `2.5.3` | `4.0.1` | [NuGet](https://www.nuget.org/packages/xunit.runner.visualstudio); latest stable. | No newer, deprecated, or vulnerable package reported; MTP test discovery passed |
| API (transitive) | Microsoft.EntityFrameworkCore / Relational | `8.0.8` resolved | `10.0.4` | Required by stable Npgsql provider 10.0.3; .NET 11 app/runtime compatibility is a validation gate. | No newer, deprecated, or vulnerable package reported; build passed; DB integration blocked |

## GitHub Actions targets

| Workflow(s) | Component | Current | Target | Evidence / outcome |
|---|---|---|---|---|
| All | actions/checkout | `v4` | `v7.0.1` | [Release](https://github.com/actions/checkout/releases/tag/v7.0.1); version pinned, workflow execution not run locally |
| quality, mobile-build | actions/setup-node | `v4`, Node `24` | `v7.1.0`, Node `26.13.1` | [Release](https://github.com/actions/setup-node/releases/tag/v7.1.0); version pinned, workflow execution not run locally |
| All | oven-sh/setup-bun | `v2`, Bun `latest` | `v2.2.0`, Bun `1.4.4` | [Release](https://github.com/oven-sh/setup-bun/releases/tag/v2.2.0); version pinned; frozen install passed locally |
| quality | actions/setup-dotnet | Not configured | `v6.1.0`, SDK `11.0.100` | [Release](https://github.com/actions/setup-dotnet/releases/tag/v6.1.0); version pinned; local .NET build passed |
| mobile-build | expo/expo-github-action | `v8`, EAS `latest` | `9.0.2`, EAS `27.9.0` | [Release](https://github.com/expo/expo-github-action/releases/tag/9.0.2); version pinned, workflow execution not run locally |
| quality | SonarSource/sonarqube-scan-action | `v6` | `v8.4.1` | [Release](https://github.com/SonarSource/sonarqube-scan-action/releases/tag/v8.4.1); version pinned, workflow execution not run locally |
| quality | SonarSource/sonarqube-quality-gate-action | `v1` | `v1.2.1` | [Release](https://github.com/SonarSource/sonarqube-quality-gate-action/releases/tag/v1.2.1); version pinned, workflow execution not run locally |
| quality | actions/upload-pages-artifact | `v3` | `v5.0.0` | [Release](https://github.com/actions/upload-pages-artifact/releases/tag/v5.0.0); version pinned, workflow execution not run locally |
| deploy | actions/deploy-pages | `v4` | `v5.0.1` | [Release](https://github.com/actions/deploy-pages/releases/tag/v5.0.1); version pinned, workflow execution not run locally |

## Exceptions and final evidence

No upgrade exception has been approved. The residual test failures are existing fixture-data leakage in web/mobile production bundles, not a dependency advisory; they are left unresolved rather than changing product behavior outside this stack-upgrade scope.

The high-severity audit gate passes, but the full Bun report still shows three transitive advisories below that threshold: `glob@11.1.0` (moderate, GHSA-3g3m-2fjr-6pw4) via Workbox, `minimatch@10.2.6` and `5.1.9` (moderate, GHSA-g3hv-75wg-m249) via ESLint/Expo/Workbox, and `deepmerge@4.3.1` (low, GHSA-gcqx-w48m-w2h4) via Workbox. No overrides were added; these versions are constrained by upstream dependency ranges. No critical or high JavaScript advisories, or NuGet vulnerabilities, were reported.

| Check | Status | Evidence / cause |
|---|---|---|
| Frozen Bun install | Passed | `npm exec --yes --package=bun@1.4.4 -c 'bun install --frozen-lockfile'` exited 0; non-fatal EPERM warning while cleaning prior linker data |
| Root, web, mobile, server, and shared tests/builds | Blocked | Root suite 79 passed, 2 skipped; server 8/8; shared 18/18; web 32/33 and mobile 21/22. The only failures are production-bundle fixture checks (`rulesAndNotes` / `cgig-101`). Web lint/build and mobile typecheck passed. |
| Expo SDK 58 compatibility, config, and exports | Passed; native build not run | Expo Doctor 20/20; public config and Android/iOS exports passed. No `eas.json` is present; EAS/device build was not run. |
| .NET 11 build and test discovery | Passed | `dotnet build` passed with 0 warnings/errors; Microsoft.Testing.Platform discovered 5 tests. Tests were not executed without a disposable database. |
| .NET integration tests with disposable PostgreSQL 15 | Blocked locally | CI has a disposable PostgreSQL service and test-only connection string; no local PostgreSQL service or available Docker daemon was found, and CI was not run. |
| JavaScript and NuGet status/advisory checks | Passed at required threshold | `bun outdated`: no outdated direct dependencies. `bun audit --audit-level=high`: no high/critical advisories. Full Bun audit: 2 moderate, 1 low transitive advisories listed above. NuGet checks: no updates, deprecated packages, or vulnerabilities. |
| Final stale-version search and `git diff --check` | Passed with CRLF note | No stale version claims found in the selected READMEs/Constitution. The plain diff check reports only CRLF line endings on added .csproj lines; `git -c core.whitespace=cr-at-eol diff --check` reports no whitespace errors. Final diff review found no schema or external database changes. |
