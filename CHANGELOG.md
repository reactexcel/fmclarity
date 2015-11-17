CHANGELOG.md

v0.2.5a
- Work order : Fixed an issue that was causing new item creation to fail
- Core : Rewrote parts of the database interface to make the code more maintainable
- Created a "Message" data model to be used for reviews and discussions
- Made a review view
- Added reviews to contractor cards

v0.2.4a
- Test users now have avatars sourced from http://api.randomuser.me
- Updated source code for various "user details" list and card views to improve compatibility
- Detailed test data for issues generated on start up
- Issue row restyled to show creator and better match material design guidelines
- Every user generate portrait is now unique
- Workorder : Conversations no longer run over container into lower workorder
- Added notifications icon
- Added sorting function to work order table
- Randomised work order creation date an sorted work order table by date

v0.2.3a 
- Fixed a problem where contractor images were not displaying correctly in the work order table
- Fixed an error that was causing the "new work order" button to fail
- Fixed an issue that was causing the selected team to reset every time any team was edited
- Can no longer create a work order for 'all facilities'
- New users now have placeholder profile image
- A selection of test users are now generated on startup and randomly assigned to teams

v0.2.2a
- Member and team/contractor profile restyled using material design guidelines, now contains all required form elements (although some are placeholders)
- Facilities profile restyled using material design, contains all basic form elements
- Work order table header restyled to match material design guidelines
- Contractors now see the issues that are assigned to them (after they are issued) - tesy by assigning issue to normal contractors and issuing it - then switching team to "normal contractors"
- Contractors can now navigate through the facilities from the issues assigned to them
- Minor global layout changes
- Changed "team blah" to kaplan and added their logo

v0.2.1a
- Moved the hamburger (so to speak)
- Fixed bug where fields were being deselected after typing one letter
- Table entries tidied up - removed grip icon - added avatars - show selected and hover state
- Enabled sticky post options
- Work requests - Arrow on rhs removed
- Created new "edit" view for teams and users
- Added 'datepicker' and 'switch' to available input types
- Updated user and account profile edit views (not yet complete)

v0.2.0a
- Removed contractor collection and made contractors into a type of Team/Account
- Made text boxes on profile pages reactive and editable by creating an autoform component
- Various bug fixes

v0.1.4a
- Created team page / detail view on right
- Update facilities page
- User profile page
- Team profile page

v0.1.3a
- [SOURCE] Collection names all plural
- Designed teams page (as mockup)
- Set up test data to test multiple teams
- teamId saved in issues for simplifying publication
- Removed inactive modules from left navigation
- Selected team now impacts on displayed issues
- Changed "all facilities" icon and text to make intention clearer

v0.1.2a (07/11/2015)
- Team members can see only facilities of the accounts they are members of
- Team members can add facilities to team
- Users current active team influences facilities that can be seen
- [SOURCE] FMAccounts renamed Team
- [SOURCE] Adding user to team moved to methods
- Invitation field clears after submit
- Created a development mode where email invitation can only be sent to a registered address
- Teams that user is a member of appear under their profile dropdown
- Users can select a team from the dropdown and the current active team saved in a session variable

v0.1.1a (03/11/2015)
- Model created for paid accounts and teams
- Added "teams" button to settings
- Added "sustainability" button to settings
- Team page created (located under settings)
- Team page can be used to invite people to a team
- When inviting a member only need their email address
- When a member is invited - if the exist - they are added to the team
- When a member is invited - if they don't exist - they are emailed an invite

v0.1.0a (14/10/2015)
- Tidied folder structure of components
- Users/Contacts view added
- Work Order : Facility name hidden from summary view when a facility is selected in top left nav

v0.0.13a (13/10/2015)
- Dashboard : Changed Non-Compliant items graph
- Work Order : Made service type selector available when order is created
- Left navigation : Buildings dropdown wraps to prevent overflow
- Picture of Rich now used as top right avatar placeholder
- Fixed "All priorities show as normal, urgent category only shows normal priority"
- Added image placeholder to reports screen
- Creating a new item now rests the filter state to "All" (preventing new items from disappearing when created under "issued" or "closed" filter)

v0.0.12a (12/10/2015)
- Navigation : Can now select facility from dropdown in left navigation
- Navigation : Can now select "All Facilities" from dropdown in left navigation
- Work Order : Work Orders now filtered according to selected facility in left navigation
- Dashboard : Graphs change when a new facility is selected (change is currently random for demonstration purposes only)
- Work Order : Modified submit button so that it changes according to the state of the order
- Work Order : Added placeholder image for work order close screen

v0.0.11a (11/10/2015)
- Changed bagdes to a more muted pallete
- Work Order : Updated Work Order summary view to give it a "gmail" feel
- Work Order : Facilities can now be selected from dropdown in detail view
- Work Order : Added buttons to toggle log / chat view
- Work Order : Added "Send Order" button

v0.0.10a (07/10/2015)
- Updated supplier browsing screen
- Updated work order screen layout
- Restyled expanded card box
- Work order : Can now select type and subtype of issue
- Work order : Can now select contractor
- Restyled work order form
- Work order : Created selector box for contracts

v0.0.9a (07/10/2015)
- Fixed a bug that was causing expanded cards to get mixed up when a new card was created
- New Order and Facility cards expand when created
- Removed building type & location from property card
- Resizeed dashboard components on larger screens
- Restyled progress indicators on dashboard using jquery-knob
- Button for card expansion (instead of double click)
- Fixed a bug that was causing cards to collapse when content was edited
- Updated card row layout and expansion / transition behaviour
- Created different expansion animations / transition for new orders and facilities
- Changed delete icon

v0.0.8a (06/10/2015)
- Created Properties(or Facilities) database collection
- Connected Facilities view to Facilties database
- Removed space at bottom of order card
- Created Issues database collection and linked it to Work Orders page
- Updated Facility card
- Added functioning delete button to Facility and Work Order cards
- Made Work Order description editable
- Activated "new" button for Facilities and Work Orders

v0.0.7a (05/10/2015)
- Made header of order unselectable (to remove the "blue bar" on double click)
- Reformatted work order form to better match screen designs
- Made title field of issue editable

v0.0.6a (29/09/2015)
- Created detail view for a work order populated with an issued order
- Removed dividers in left navigation menu
- Left navigation menu now has fixed position
- Placeholder bar chart added to ABC screen
- Fixed problem where clicking on body of expanded card would close the card
- Issued and closed work orders identify contractor instead of requestor

v0.0.5-a (28/09/2015)
- Added Updated Work Order card placeholder to more closely resemble interface designs
- Added Contract test data
- Added Contract card / table row
- Updated cards expansion behaviour
- Fixed a problem where selected item in left navigation bar was being unneccesarily indented

v0.0.4-a (27/09/2015)
---------------------
- Created property card
- Created Facility data model linked into Property filterbox with test data
- Fixed a bug where app would sometimes lose user and crash when returning after a pause

v0.0.3-a (26/09/2015)
---------------------
- Replace png logo with svg logo (for better res on mobile / retina displays)
- Added placeholders for line charts, bar charts and progress arcs to dashboard and ABC
- Properties menu item moved into settings
- Increased icon size in left navigation bar
- Formatted cards in filter view as vertical stream
- Added Google inbox style opening effect for filter-view cards
- Created placeholder cards for work orders

v0.0.2-a (25/09/2015)
---------------------
- Added placeholder FullCalendar.js to Dashboard and PMP
- Updated filter buttons on properties, contracts, work requests and suppliers pages

v0.0.1-a (25/09/2015)
---------------------
- Simple login screen with registration disabled
- Basic branding and simple, Asana like, theme
- Working left navigation with routing and placeholder pages
- Placeholders for notifications, off canvas right navigation bar and user info