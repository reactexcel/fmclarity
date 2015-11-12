ROADMAP.md

- should stick items ignore the filter?

TODO (general)
- Brainstorm list of "actions" for RBAC inc[create facility, add to team, create contact, add to team, edit own profile, edit other profile]
- Work out team selection interface element
- Tidy folder structure and create component dictionary 
- Remove redundant JS libraries (that came with Inpinia)
- Write test plan [login, click through each screen, create a work order, invote a user to a team]

IN PROGRESS
- Member profile needs to contain all form elements in screen designs
- Contractor cards should be set up to show team, rating, reviews, when browsing

v0.3.0a "Little Bob" (17/11/2015)
- Facilities need to include all configurable form elements in screen designs
- Accounts have "teams", "facilities" and "contacts"
- Users can add contacts for their team, users current active account influences contacts that can be seen
- Accounts have a contact list of "preferred contractors" (v0.3.0a+ - these preferred contractors can be selected from contractor directory)
- Team page has RBAC
- Contractors need to have a distinct view (different colour scheme?)
- Reconsider column order and ensure that column headers are above relevant items
- All buildings no longer appearing
- Comments should be 13 point, description should be body point, Differentiate sizes between H1 & H2
- Typography should be treated universally. Ie body font should work across all devices
- Showing company logo is good but display needs to be rethought, remove borders
- Service types should be a combination of suggestive search and combo box
- Remove browse button from dropdown boxes
- Consistency around button styles (this may be resolved on Friday)
- Move photo/file respository icons horizntally above images
- Remove drag and drop icon from work requests and change to a pin that when activated it would change colour
- Change out issued status with another colour (this should get resolved at next meeting with Kongo)
- Swap out red sample contractor icon with another colour
- Reinstate notifications
- Create activated and deactivated state for hamburger navigation menu button
- Shouldn't be able to create a work order for 'all facilities'
- Work requests -  Can sorting and filtering be visible and easy rather than users having to open a dropdown? Ie have text buttons
- Include work request type, eg preventative maintenance, ad-hoc, base building, warranty, contract, no-cost
- Automatic completion of contractor based on type of repair
- Need detail around value of work order, work order number, job location 
- Populate comments and history sections with realistic info

v0.4.0a "Demo v2"
- Image placeholders for new members, teams
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
- Facilities have their own team which may include members from another account - be it another paid FM Clarity account, or a contractor account, a facility that is created by a member of an account, by default, has that accounts members as its team - but this can be changed after facility creation
- Facilities field autocompletes
- Created "facilities selector" widget
- Invite field autocompletes
- Fix email invite
- Pimp invite user field