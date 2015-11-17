ROADMAP.md

- should sticky items ignore the filter?



- Auto generate random reviews on startup


TODO (general)
- Brainstorm list of "actions" for RBAC inc[create facility, add to team, create contact, add to team, edit own profile, edit other profile]
- Tidy folder structure and create component dictionary 
- Remove redundant JS libraries (that came with Inpinia)
- Write test plan [login, click through each screen, create a work order, invote a user to a team]


IN PROGRESS
- Rationalise account form using my new schema system (cols becomes size)
- create a new AccountCard which shows contact card at top and account detail below (account detail probably wrapped in two separate components, one for fm and one for contractor)
- Rename AccountEdit and AccountView?

---
- Generate more extensive test data for contractor teams
- Generate contractor review for closed work orders
- Management teams see creator and contractor team, contractor teams see creators teams and assignee
- Contractor cards should be set up to show team, rating, reviews, when browsing
- Autogenerate contact for facilities and add to facilities card
- Add outstanding issues to facilities card
- 

v0.3.0a "Little Bob" (17/11/2015)
- Should not reuse email addresses when generating user data
- Users can add contacts for their team, users current active account influences contacts that can be seen
- Accounts have a contact list of "preferred contractors" (v0.3.0a+ - these preferred contractors can be selected from contractor directory)
- Make module selection options work
- Contractors need to have a different menu view
- All buildings no longer appearing
- Remove browse button from dropdown boxes


v0.4.0a "Demo v2"
- Automatic completion of contractor based on type of repair
- Setup discussion system
- Populate comments and history sections with realistic info
- Settings menu doesn't work very well in minimized view - should be tabbed subselection
- iBoxes should be evently spaced (currrently the space in the centre iw bigger than the gutter)
- Dashboard should look and feel more "cutting edge" with some cool looking D3 visualisations instead of graphs (TODO: find some examples)
- Need better quality, real world test data (for work orders and the like)
- Add sorting functionality to work orders table
- Implement Adrian's recommended changes to work order appearance
- Add notifications again, and make them work
- Preferably make images and files uploadable (alternatively work out a compromise mockup of this functionality)
- Service types - where are they now? What state should they be in for this demo? I suppose it relates to the completion of the facility form
- When creating a work order, need to be able to assign job not just to a team but also to an individual within that team
- Would be nice if communication section on work order was live but this is not priority 1
- Floorplans and lease end dates
- Photographs of actual Kaplan properties
- Demo users and their profiles

v0.5.0a
- Need a message system so that notifications can be accurate, and so that contractors can archive an order without deleting it from managers view
- Facilities have their own team which may include members from another account - be it another paid FM Clarity account, or a contractor account, a facility that is created by a member of an account, by default, has that accounts members as its team - but this can be changed after facility creation
- Facilities field autocompletes
- Created "facilities selector" widget
- Invite field autocompletes
- Fix email invite
- Pimp invite user field

UNCATEGORISED
- Team screen : when a new user is created should be selected
- Placeholder avatars using initials
- Validation required for form elements
- Team page has RBAC
- Work order: "Sticky" pin should be moved to the right of the, selection box with requestor in the left

Adrians Recommendations
- Comments should be 13 point, description should be body point, Differentiate sizes between H1 & H2
- Typography should be treated universally. Ie body font should work across all devices
- Showing company logo is good but display needs to be rethought, remove borders
- Service types should be a combination of suggestive search and combo box
- Consistency around button styles (this may be resolved on Friday)
- Move photo/file respository icons horizntally above images
- Change out issued status with another colour (this should get resolved at next meeting with Kongo)
- Swap out red sample contractor icon with another colour
- Include work request type, eg preventative maintenance, ad-hoc, base building, warranty, contract, no-cost
- Need detail around value of work order, work order number, job location 

