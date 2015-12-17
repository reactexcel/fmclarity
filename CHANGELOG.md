CHANGELOG.md
============

**v0.3.8a**

* Removed dividers in dropdowns
* Suppliers in work order drop down are now limited to those specified in a teams "suppliers" page
* No longer need to assign order to close it
* Restricted editing WO after they have been issued
* WO: Disabled sorting for new work orders while they are being created
* WO: Added ability to cancel/reverse new/issued work orders
* WO: Only one work order can be expanded at the one time
* WO: Work orders close when sort or filter activated

**v0.3.7a**

* Fixed issue where dropdown boxes were wrong size or had text overflow
* Added "pointer" cursor style to dropdown menu items and to contacts, and other relevant locations
* Added hover state for dropdown menu items
* Fixed an issue where items on the left navigation where being cut off in the minimised state
* WO: Need to be the selected supplier before you can select assignee

**v0.3.6a**

* Can scroll through service types
* Fixed problem causing "newItemCallback not a function" error in FilterBox2
* Fixed a bug that was causing program to crash when trying to open portfolio of contractor with no requests
* Can now change the avatar/logo for users and teams
* Cleaned source: Autoform component now passes new value to callback instead of needlessly simulated event structure
* Cleaned source: Removed underscore prefix from field names in facility table
* Suppliers: Can add new contractors in same manner as adding members to team
* Team settings: Can remove members from team
* Suppliers: Can remove suppliers from list

**v0.3.5a**

* Clicking away from a dropdown closes it
* New feature - improved facilities selector
** WO: Facilities appearing in drop down for new work order should are filtered by selected team
** WO: Available areas are filtered by selected facility
* New feature - can add and remove contacts
** Facility settings: Can add new contacts and tenants to facilities
** Facility settings: Can remove contacts and tenanats from facilities
** Team: Pushing (+) button brings modal to invite new or add existing user

**v0.3.4a**

* In preparation for beta release:
** Changed test data generation routines 
** Created development and master code branch
** Added account for Brad Wilkinson

**v0.3.3a**

* Integrated basic discussions to WO

**v0.3.2a**

* Due dates are colour coded
* Removed description from notifications
* Removed description from facilities
* Generate much fewer contacts and issues for test data
* Create data model for messages and start to implement discussions on wos

**v0.3.1a**

* Basic file upload functionality completed
* File upload functionality added to "images" tab of WO and "documents & images" tab of facility

**v0.3.0a**

* Pinned items ignore filter
* Additional stage for work orders that have been requested but not approved by FM
* WO : due date calculated when order is issued
* WO table: can sort by due date
* Added a modal dialog box that shows contact/tenant details when clicked on (this will be used for adding new contacts)

**v0.2.16**

* WO detail: Contacts tab on work order
* WO detail: Added fake "level" info to the area selection drop down
* WO detail: Dialog for closing out work order

**v0.2.15a**

* WO detail: Delineated work order summary and detail
* WO detail: Reduced kerning and weight of heading
* WO detail: Cost threshold in wo detail is editable
* WO detail: Fixed the placeholders for new issues
* WO: Fix error causing newly created work orders to disappear when title typed
* WO detail: Can assign wo to team member
* Can create new work order while "all facilities selected" (will have to block submission until facility chosen)
* WO detail: Changed area selection input

**v0.2.14a**

* Can reselect "All facilities" from navigation dropdown
* Added WO#, issue area and cost threshold to work order
* Updated service test data for Kaplan demo

**v0.2.13a**

* Dashboard spacing should be consistent
* When a new facility is created it appears at the top of the list.
* When a new facility is created it is automatically selected
* Facilities, suppliers, team members are sorted alphabetically
* When a new facility is created it now has a placeholder image
* Fixed a problem whereby editing supplier details seem to cause program (notifications) to crash
* Facility item now only shows contact information when a contact has been entered
* Added issue due dates
* When a new facility is created the "contact" information is now blank

**v0.2.12a**

* Facilities area and service selector

**v0.2.11a**

* Finished core functions for notification system
* Integrated user notifications into top navigation bar
* Integrated work order notifications into work order detail screen
* Rolled work order "conversations" and "work log" into "updates"

**v0.2.10a**

* Facilities : Removed line from seecond level headings in facilities form
* Facilities : Changed icon in collapsible boxes
* Facilities : Added property type, lettable areas, facility holder details, lease details, insurance details, security deposit to form
* Facilities : Added contacts field to facilities data model, added contacts area to facilities form
* Facilities : On startup - now generate a random user to be the contact for each facility
* WO : Reorder tabs so that images are first and open by default, documents, conversation, log
* WO : Changed closed order to black
* WO : Changed notification color to GMDG pink (500)
* Core : Created model and basic functions for notification system

**v0.2.9a**

* General : Removed redundant Inspinia JS plugins and Meteor packages to improve performance on my shitty laptop that I have with me in Cairns
* Facility : Made some updates to the "Autoform" form generation code that will facilitate completion of the Facilities form
* WO : Finished tab functionality used in Work Order detail page
* WO : Moved files and images into tabs, moved tabs to below discussion
* Updated Kaplan facility test data so that address fields are correctly populated
* WO table : cleaned up scrolling behaviour of newly opened orders


**v0.2.8a**

* WO : fixed colours to match Adrian's design
* WO : Changed position and shape of service type and supplier drop downs
* WO : Restyled buttons to match MD guidelines
* WO : Open work order form now expands to match height of content
* Facility form : Made collapsible groups for form elements
* Facility form : Started to enter new form inputs

**v0.2.7a**

* New facilities can now be added to team
* Changed core form rendering function for Teams, Facilities, Users to help with creation of new Facility form
* Changed textareas to material design style in order to make accordians
* Reformatted markup files

**v0.2.6a**

* Updated work orders to match Adrian's design
* Can reverse sort work order tables
* Can not switch on/off modules from account settings
* Contractors have different default modules than managers

**v0.2.5a**

* Work order : Fixed an issue that was causing new item creation to fail
* Core : Rewrote parts of the database interface to make the code more maintainable
* Created a "Message" data model to be used for reviews and discussions
* Made a review view
* Added reviews to contractor cards

**v0.2.4a**

* Test users now have avatars sourced from http://api.randomuser.me
* Updated source code for various "user details" list and card views to improve compatibility
* Detailed test data for issues generated on start up
* Issue row restyled to show creator and better match material design guidelines
* Every user generate portrait is now unique
* Workorder : Conversations no longer run over container into lower workorder
* Added notifications icon
* Added sorting function to work order table
* Randomised work order creation date an sorted work order table by date

v0.2.3a 

* Fixed a problem where contractor images were not displaying correctly in the work order table
* Fixed an error that was causing the "new work order" button to fail
* Fixed an issue that was causing the selected team to reset every time any team was edited
* Can no longer create a work order for 'all facilities'
* New users now have placeholder profile image
* A selection of test users are now generated on startup and randomly assigned to teams

**v0.2.2a**

* Member and team/contractor profile restyled using material design guidelines, now contains all required form elements (although some are placeholders)
* Facilities profile restyled using material design, contains all basic form elements
* Work order table header restyled to match material design guidelines
* Contractors now see the issues that are assigned to them (after they are issued) - tesy by assigning issue to normal contractors and issuing it - then switching team to "normal contractors"
* Contractors can now navigate through the facilities from the issues assigned to them
* Minor global layout changes
* Changed "team blah" to kaplan and added their logo

**v0.2.1a**

* Moved the hamburger (so to speak)
* Fixed bug where fields were being deselected after typing one letter
* Table entries tidied up - removed grip icon - added avatars - show selected and hover state
* Enabled sticky post options
* Work requests - Arrow on rhs removed
* Created new "edit" view for teams and users
* Added 'datepicker' and 'switch' to available input types
* Updated user and account profile edit views (not yet complete)

*Milestone - 0.2.0a*

* Live data model added

**v0.2.0a**

* Removed contractor collection and made contractors into a type of Team/Account
* Made text boxes on profile pages reactive and editable by creating an autoform component
* Various bug fixes

**v0.1.4a**

* Created team page / detail view on right
* Update facilities page
* User profile page
* Team profile page

**v0.1.3a**

* [SOURCE] Collection names all plural
* Designed teams page (as mockup)
* Set up test data to test multiple teams
* teamId saved in issues for simplifying publication
* Removed inactive modules from left navigation
* Selected team now impacts on displayed issues
* Changed "all facilities" icon and text to make intention clearer

**0.1.2a**

* Team members can see only facilities of the accounts they are members of
* Team members can add facilities to team
* Users current active team influences facilities that can be seen
* [SOURCE] FMAccounts renamed Team
* [SOURCE] Adding user to team moved to methods
* Invitation field clears after submit
* Created a development mode where email invitation can only be sent to a registered address
* Teams that user is a member of appear under their profile dropdown
* Users can select a team from the dropdown and the current active team saved in a session variable

**0.1.1a**

* Model created for paid accounts and teams
* Added "teams" button to settings
* Added "sustainability" button to settings
* Team page created (located under settings)
* Team page can be used to invite people to a team
* When inviting a member only need their email address
* When a member is invited - if the exist - they are added to the team
* When a member is invited - if they don't exist - they are emailed an invite

**0.1.0a**
* Tidied folder structure of components
* Users/Contacts view added
* Work Order : Facility name hidden from summary view when a facility is selected in top left nav

*Milestone - 0.1.0a*

* Basic functionality fit for first demo

**0.0.13a**

* Dashboard : Changed Non-Compliant items graph
* Work Order : Made service type selector available when order is created
* Left navigation : Buildings dropdown wraps to prevent overflow
* Picture of Rich now used as top right avatar placeholder
* Fixed "All priorities show as normal, urgent category only shows normal priority"
* Added image placeholder to reports screen
* Creating a new item now rests the filter state to "All" (preventing new items from disappearing when created under "issued" or "closed" filter)

**0.0.12a**

* Navigation : Can now select facility from dropdown in left navigation
* Navigation : Can now select "All Facilities" from dropdown in left navigation
* Work Order : Work Orders now filtered according to selected facility in left navigation
* Dashboard : Graphs change when a new facility is selected (change is currently random for demonstration purposes only)
* Work Order : Modified submit button so that it changes according to the state of the order
* Work Order : Added placeholder image for work order close screen

**0.0.11a**

* Changed bagdes to a more muted pallete
* Work Order : Updated Work Order summary view to give it a "gmail" feel
* Work Order : Facilities can now be selected from dropdown in detail view
* Work Order : Added buttons to toggle log / chat view
* Work Order : Added "Send Order" button

**0.0.10a**

* Updated supplier browsing screen
* Updated work order screen layout
* Restyled expanded card box
* Work order : Can now select type and subtype of issue
* Work order : Can now select contractor
* Restyled work order form
* Work order : Created selector box for contracts

**0.0.9a**

* Fixed a bug that was causing expanded cards to get mixed up when a new card was created
* New Order and Facility cards expand when created
* Removed building type & location from property card
* Resizeed dashboard components on larger screens
* Restyled progress indicators on dashboard using jquery-knob
* Button for card expansion (instead of double click)
* Fixed a bug that was causing cards to collapse when content was edited
* Updated card row layout and expansion / transition behaviour
* Created different expansion animations / transition for new orders and facilities
* Changed delete icon

**0.0.8a**

* Created Properties(or Facilities) database collection
* Connected Facilities view to Facilties database
* Removed space at bottom of order card
* Created Issues database collection and linked it to Work Orders page
* Updated Facility card
* Added functioning delete button to Facility and Work Order cards
* Made Work Order description editable
* Activated "new" button for Facilities and Work Orders

**0.0.7a**

* Made header of order unselectable (to remove the "blue bar" on double click)
* Reformatted work order form to better match screen designs
* Made title field of issue editable

**0.0.6a**

* Created detail view for a work order populated with an issued order
* Removed dividers in left navigation menu
* Left navigation menu now has fixed position
* Placeholder bar chart added to ABC screen
* Fixed problem where clicking on body of expanded card would close the card
* Issued and closed work orders identify contractor instead of requestor

**0.0.5a**

* Added Updated Work Order card placeholder to more closely resemble interface designs
* Added Contract test data
* Added Contract card / table row
* Updated cards expansion behaviour
* Fixed a problem where selected item in left navigation bar was being unneccesarily indented

**0.0.4a**

* Created property card
* Created Facility data model linked into Property filterbox with test data
* Fixed a bug where app would sometimes lose user and crash when returning after a pause

**0.0.3a**

* Replace png logo with svg logo (for better res on mobile / retina displays)
* Added placeholders for line charts, bar charts and progress arcs to dashboard and ABC
* Properties menu item moved into settings
* Increased icon size in left navigation bar
* Formatted cards in filter view as vertical stream
* Added Google inbox style opening effect for filter-view cards
* Created placeholder cards for work orders

**0.0.2a**

* Added placeholder FullCalendar.js to Dashboard and PMP
* Updated filter buttons on properties, contracts, work requests and suppliers pages

**0.0.1a**

* Simple login screen with registration disabled
* Basic branding and simple, Asana like, theme
* Working left navigation with routing and placeholder pages
* Placeholders for notifications, off canvas right navigation bar and user info
