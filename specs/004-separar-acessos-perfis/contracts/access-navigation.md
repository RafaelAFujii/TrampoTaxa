# Cross-Platform Access and Navigation Contract

This contract defines the user-facing access boundary on Web and Mobile. It does not
replace server-side authentication or authorization.

## Access entries

| Platform | Entry | Required presentation |
|---|---|---|
| Web | `/login` | Offers a clear choice between contractor and freelancer access without showing an authenticated profile screen. |
| Web | `/login/freelancer` | Identifies freelancer access and does not offer a contractor profile toggle. |
| Web | `/login/contractor` | Identifies contractor access and does not offer a freelancer profile toggle. |
| Mobile | Freelancer access | Identifies freelancer access and does not expose contractor-only navigation. |
| Mobile | Contractor access | Identifies contractor access and does not expose freelancer-only navigation. |

## Protected destinations

| Platform | Destination group | Required role | Default landing |
|---|---|---|---|
| Web | `/map`, `/active-gig`, `/earnings`, `/profile`, `/settings` | `Freelancer` | `/map` |
| Web | `/contractor/gigs`, `/contractor/create`, `/contractor/reports`, `/contractor/chat` | `Contratante` | `/contractor/gigs` |
| Mobile | Map, earnings, profile | `Freelancer` | Map |
| Mobile | Gigs, gig creation, reports, chat | `Contratante` | Gigs |

Mobile destination names are implemented using the existing React Navigation
structure; the table defines user-visible destination groups, not route identifiers.

## Navigation and session behavior

1. Unauthenticated access to a protected destination opens the access entry for that
   destination's required role and may retain the original destination for return.
2. Successful authentication uses the role on the authenticated account, not a stale
   route, chosen role, or previous session.
3. A retained destination is restored only if it belongs to the authenticated
   account's role; otherwise the platform opens that role's default landing.
4. A signed-in account opening a destination for the other role is redirected to its
   own default landing. No mismatched profile content is rendered during transition.
5. Logout and account change clear the previous role's active navigation state before
   presenting another access entry.
6. Mobile session restoration shows no protected role screens until the authenticated
   account role is resolved. An unavailable or unsupported role remains in a
   non-protected access/error state.
7. Social-login buttons, where present, follow the same role-specific success
   destination as standard login.
8. Authentication failure remains on the selected access entry, displays an error
   state, and does not show protected content.
9. Mobile contractor navigation provides access to gigs, gig creation, reports and
   chat; freelancer map, earnings and profile destinations are not part of that
   navigation tree.

## Security and scope

- The client role boundary prevents mismatched user experiences; it is not authority
  for access to protected server data or operations.
- Existing Web mock authentication and Mobile JWT authentication remain distinct.
- Account identity has one profile per account; changing profile requires signing out
  and signing in with another account.
