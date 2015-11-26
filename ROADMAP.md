ROADMAP.md
==========

TODO (general)
--------------
* should sticky items ignore the filter?
* Brainstorm list of "actions" for RBAC inc[create facility, add to team, create contact, add to team, edit own profile, edit other profile]
* Tidy folder structure and create component dictionary 
* Write test plan [login, click through each screen, create a work order, invote a user to a team]

DONE
----

IN PROGRESS
-----------

v0.3.0a "Demo v2"
------------------------------

**Slack prioritization**

* Adding new facilities
* Facilities form with the fields from your spreadsheet
* Sections for floor plans and other items on property

* Finalise work order design
* Close out work order screen

* Contractors filtered by service type when creating a work order
* Being able to write reviews for contractors on closed work orders
* Conversations in work orders
* Being able to assign an work order to a team member

* Notifications when work orders progress
* Work order log

* File uploads and document/image management including
* Browsing for contractors and adding preferred contractors to a contact list
* Dashboard reflecting real data

**Work order detail**

* Auto generate service types for contractors
* Filter contractor based on type of repair
* Make discussion component (for log an comments)
* Hook discussions into notifications widget
* When creating a work order, need to be able to assign job not just to a team but also to an individual within that team
* Create images/files attachment component

**Work order table**

* Management teams see creator and contractor team, contractor teams see creators teams and assignee
* Fix sorting by creators

**Test data**

* Generate more extensive test data for contractor teams
* Auto generate random reviews on startup
* Generate contractor review for closed work orders
* Autogenerate contact for facilities and add to facilities card
* Populate comments and history sections with realistic info
* Need better quality, real world test data (for work orders and the like)

**Facilities card**

* Reformat facilities card
* Add outstanding issues to facilities card
* Add floorplans and lease end dates

**Suppliers page**

* Users can add contacts for their team, users current active account influences contacts that can be seen
* Accounts have a contact list of "preferred contractors" (v0.3.0a+ - these preferred contractors can be selected from contractor directory)

**Dashboard**

* iBoxes should be evently spaced (currrently the space in the centre iw bigger than the gutter)
* Dashboard should look and feel more "cutting edge" with some cool looking D3 visualisations instead of graphs (TODO: find some examples)

**Other**

* Photographs of actual Kaplan properties

**UNCATEGORISED**

* Team screen : when a new user is created should be selected
* Placeholder avatars using initials
* Validation required for form elements
* Team page has RBAC
* Work order: "Sticky" pin should be moved to the right of the, selection box with requestor in the left
* All buildings no longer appearing
* Remove browse button from dropdown boxes
* Should not reuse email addresses when generating user data
* Settings menu doesn't work very well in minimized view - should be tabbed subselection
* Facilities have their own team which may include members from another account - be it another paid FM Clarity account, or a contractor account, a facility that is created by a member of an account, by default, has that accounts members as its team - but this can be changed after facility creation
* Facilities field autocompletes
* Created "facilities selector" widget
* Invite field autocompletes
* Fix email invite
* Pimp invite user field

