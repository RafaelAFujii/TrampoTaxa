# Quickstart: Validar separação de acessos Web e Mobile

Run commands from the repository root. Web currently uses mock authentication and
Mobile uses a JWT session. For manual end-to-end Mobile checks, use an environment
with accounts and API responses for both supported roles.

## Prerequisites

- Bun or npm and repository dependencies installed.
- Web workspace at `apps/web` and Mobile workspace at `apps/mobile`.
- A Mobile test environment capable of authenticating and restoring both account
  roles.

## Automated validation

1. Run the Web Vitest suite:

   ```powershell
   npm --prefix apps/web test
   ```

   Expected: role-specific access, wrong-role route, post-login redirect, logout and
   account-switch tests pass.

2. Run Web lint and TypeScript checks:

   ```powershell
   npm --prefix apps/web run lint
   ```

   Expected: ESLint and TypeScript complete without errors.

3. Build the Web application:

   ```powershell
   npm --prefix apps/web run build
   ```

   Expected: Vite produces the Web production build successfully.

4. Run Mobile Vitest tests and type checking:

   ```powershell
   npm --prefix apps/mobile test
   npm --prefix apps/mobile run typecheck
   ```

   Expected: role restoration, role-specific navigation, sign-out and contractor
   navigation tests pass, and TypeScript reports no errors.

## Manual acceptance scenarios

1. On Web and Mobile, open freelancer access and verify it is identified for
   freelancers without contractor-only navigation.
2. Sign in as a freelancer and verify the map is shown as the initial experience.
3. Log out, sign in as a contractor and verify the contractor experience appears
   without freelancer map or freelancer-only controls.
4. Verify contractor access to gigs, gig creation, reports and chat on both platforms.
5. Repeat contractor → logout → freelancer and verify the freelancer experience is
   shown without contractor-only screens.
6. On Web, directly open a route for the other role and use browser Back/Forward after
   account change; verify the current account's role still controls the displayed
   experience.
7. On Mobile, restore each role's session after closing and reopening the app; verify
   only that role's navigation appears and that restoration does not default to
   freelancer for a contractor account.
8. Cause an authentication failure on either platform and verify the public access
   entry and error state remain visible without protected content.

See the [Cross-Platform Access and Navigation Contract](./contracts/access-navigation.md)
and [data model](./data-model.md) for role/session invariants.
