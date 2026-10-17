# Quickstart: Validate Refatoração Crítica da Arquitetura

Run commands from the repository root unless a step explicitly changes directory.

## Prerequisites

- Install the monorepo dependencies with Bun.
- Use the Expo SDK and React Native versions declared in `apps/mobile/package.json`.
- Use the feature branch or checkout containing the implementation.

## 1. Validate API tag naming and generate the shared client

```bash
bun run api:generate
```

Expected:

- Generation reads the contract and Orval configuration from `packages/shared`.
- Every tag passes the lowercase ASCII kebab-case rule before Orval runs.
- Generated endpoint directories use ASCII names under
  `packages/shared/src/api/endpoints/`.
- Invalid tags or generation errors return a non-zero exit status.

## 2. Verify shared imports and fixtures

```bash
npm --prefix packages/shared test
```

Expected:

- Shared package tests pass.
- Root exports expose domain types, utilities, and generated API, but not fixture data.
- Tests needing fixtures can import them through `@trampotaxa/shared/mocks`.

## 3. Build and inspect Web production output

```bash
npm --prefix apps/web run build
```

Expected:

- The build succeeds.
- Web production assets under `apps/web/dist/` do not include fixture-only data or
  recognizable fixture identifiers.

## 4. Type-check Mobile and verify its production bundle

```bash
npm --prefix apps/mobile test
npm --prefix apps/mobile run typecheck
```

Expected:

- The Mobile app type-checks with navigation, session, and API request contracts.
- Session tests cover restoration, missing credentials, sign-out, unauthorized
  responses, and protected versus public request headers.
- A production export contains no mock fixture data:

```bash
cd apps/mobile
npx expo export --platform android --output-dir dist
```

Inspect the generated production bundle and assets in `apps/mobile/dist/` for known
fixture-only identifiers. Repeat for iOS if the build environment supports it.

## 5. Verify authentication behavior

Run the targeted Mobile session and API request tests added by implementation. Confirm:

1. No stored JWT leaves the app unauthenticated, and private requests are rejected
   before network dispatch.
2. Restored or newly established JWTs are persisted with platform-protected storage and
   are sent only for private API operations.
3. Sign-out and unauthorized responses clear in-memory and persisted credentials and
   remove protected navigation.
4. Secure storage failures are surfaced and never result in an authenticated state.

## Validation record

- Shared tests: passed (29 tests).
- Mobile tests, including production bundle fixture checks: passed (16 tests).
- Mobile TypeScript check: passed.
- Web lint/typecheck and production build: passed; Vite reports a large-chunk advisory.
- Android Expo production export: passed; known mock fixture markers were absent from
  `apps/mobile/dist/`.
- Web production bundle fixture test: passed.
- Orval generation and ASCII kebab-case tag validation: passed.
- OpenAPI comparison against the prior Web-owned contract confirmed all 14 HTTP paths
  and `operationId` values are unchanged.
