# Authentication and navigation

TODO:

- consolidate PageLogin et al into one file or component
- package this component
- package router/navigation component
- flowchart for router

## Visual components

- client/pages
-- PageLogin
-- Page404
-- PageChangePassword
-- PagePassword
-- PageRegister

## Related files and packages

- fmc:login-tokens
- client/router.js
- client/layouts/SideNav (to be packaged with router and come getUrl style functions)

## Requests

- Upon login, bring user to the dash (currently goes to portfolio)
- Logged in as Royal Eagle, logged out and in as me. Clicked link again in email and it showed the work order but logged in as me rather than royal eagle
- When team members are removed from all teams They are taken to an an "inactive account" page where they can still access their profile but need another invitation before they can go into a team. A warning dialog should appear to the admin
- Teams should have an "owner" - owners cannot be removed from the team
- Team settings: When person removed from a team they should be deselected

# Access and permissions

TODO:

- visual map of permissions and subscriptions

## Related files and packages

- fmc:rbac
- fmc:orm?

* Permissions and subscriptions
- Viewing rules for work orders - staff should only see own (or possible other staff)
- Had a weird bug just now. Was previously logged in as Royal Eagle, logged out then back in again as me. Opened on Portfolio, navigated to the dash, then suppliers where there was only kaplan as a supplier. I checked the settings dropdown and then all the other suppliers appeared
- Management teams see creator and contractor team, contractor teams see creators teams and assignee

