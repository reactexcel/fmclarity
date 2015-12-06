ROADMAP.md
==========

TODO (general)
--------------
* Brainstorm list of "actions" for RBAC inc[create facility, add to team, create contact, add to team, edit own profile, edit other profile]
* Tidy folder structure and create component dictionary 
* Write test plan [login, click through each screen, create a work order, invote a user to a team]

DONE
----

IN PROGRESS
-----------

* Due dates should be colour coded
* Include date attended, date finalised, date reviewed
* SSL
* RBAC
* Email notifications
* When flicking through facilities, areas and services do not update
* Need a select type control (for property type for example) that matches material design (how about using a dropdown and styling label)
* When create a new facility, enter no details, reload, then select new facility... card does not appear
* Editing a contractor, and then editing "your" team, nukes the previous notification, and then editing a contractor again brings it back... weird
* Finsh "close out work order" screen
* Contractors filtered by service type when creating a work order
* Conversations in work orders, make discussion component (for log an comments), hook discussions into notifications widget
* Notifications when work orders progress
* Add new contractor button - works the same as adding a new user
* Browsing for contractors and adding preferred contractors to a contact list (this is contracts)
* Dashboard reflecting real data
* Management teams see creator and contractor team, contractor teams see creators teams and assignee
* Validation required for form elements
* Cross browser / cross device compatibility
* Settings menu doesn't work very well in minimized view - should be tabbed subselection

** Low priority **

* Facilities: Add issue summary to diplay card
* Need to be able to delete items (facilities, requests, users) when giving demo - otherwise the data just gets contaminated with random rubbish
* Team: Position title in team members list
* Populate comments and history sections with realistic info
* Need better quality, real world test data (for work orders and the like)
* Should not reuse email addresses when generating user data
* Being able to write reviews for contractors on closed work orders
* Placeholder avatars using initials
* Facilities have their own team which may include members from another account - be it another paid FM Clarity account, or a contractor account, a facility that is created by a member of an account, by default, has that accounts members as its team - but this can be changed after facility creation
* Dashboard should look and feel more "cutting edge" with some cool looking D3 visualisations instead of graphs (TODO: find some examples)
* Reformat facilities card
* Add outstanding issues to facilities card
* Add floorplans and lease end dates
* Advanced address picker



* Should be using react-bootstrap with browserfy