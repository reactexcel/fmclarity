CHANGELOG.md
============

**v0.5.2a**

* MD style select
* Updated services selector for properties
* Supplier selected in facility service configuration screen is now the default when a request is created with that service

**v0.5.1a**

* Added option to delete profile thumbnail
* Fixed a bug which was causing images with an apostrophe in their filename to display incorrectly
* Messages written in updates section of a request no send notification to all request watchers
* Closed issues no longer appear in "All" view
* Automatic adding of test data to incisive
* Made changes to test data generation routines to improve testing
* Cleaned up images folder, removed default images left from previous versions
* Tightened security of edits on "public" links to requests
* Changed the way active modules/navigations items are handled to improve role-based accounts
* Began restructuring services and area model

**v0.5.0a**

* RBAC completed

**v0.4.3a**

* RBAC for facilities, teams
* Rewrote core data access models to include server-side authentication and validation
* Included saving of a users role into ORM
* Wrote exception handling system with toast error notifications server side
* Consolidated RBAC ainto separate package
* Consolidated ORM into separate package
* Updated all models (Teams, Users, Issues, Facilities) to include authentication functions for every sensitive action
* Fixed an error which was causing no redirect after login
* Fixed an error which was causing unepected login page style after logging out
* Progress indicator on file upload

**v0.4.2a**

* Fixed a bug that was causing members added to a new supplier to be incorrectly added to your team - not the suppliers
* Restyled login page
* Facility thumbnails now cover full height and width of thumbnails regardless of image aspect ratio
* Facility card images now cover full height and width of thumbnails regardless of image aspect ratio
* Fixed bug: When a new facility is created an errant label "CreateNewItem" appears (2✓)

**v0.4.1a**

* Version number at bottom of user profile screen now links to changelog
* Notifications sorted most to least recent
* Fixed a problem what was causing the creation of tenants or contacts on facility to fail
* Fixed an issue that was causing some supplier and user thumbnails to not display

**v0.4.0a**

* Dashboard linked to issue events

**v0.3.27a**

* Refactor of Object Relational Mapping code to facilitate better calculations of monthly issues for dashboard
* Completed dashboard line chart
* Changed status names to prevent empty (-) status for items being created

**v0.3.26a**

* Fixed a bug which was causing app to crash on unexpected facility contact or tenant
* Fixed a bug which was causing selected item to change when editing
* Work orders that have not been 
* Description textarea now honours line breaks
* WO: Changed notification shields to bracketed numbers
* User edit modal: Fixed a bug that was making the "Remove from team" action always apply to the active team (even when it shouldn't)
* WO: Fixed a bug that was causing suppliers viewed from contacts tab to appear as invite prompt
* Suppliers/Account settings: Fixed a problem that was causing members list to not update when a member invited or removed
* Account settings: Fixed a bug that was causing the default value to overlap text
* Account settings: Default work order value now working

**v0.3.25a**
* Fixed bug which was causing actions menu icon to appear outside container
* Centred notifications badge for two digit numbers
* Prevented multiple submissions of work orders
* Left aligned all elements in profile menu
* Differentiated and updated test data generation routines to make live master usable for FM Clarity issue tracking

**v0.3.24a**

* Add conditional padding class to address new button misalignment on small screens
* Changed names of module switches to Repairs and Portfolio
* Notifications now clear when notifications window is closed
* Users can no longer remove themselves from teams
* Teams and users have a new actions menu which must be used to: 1. Toggle between edit and view mode 2. Remove supplier/member from a team

**v0.3.23a**

* Suppliers page: Switching suppliers resets selected supplier
* WO: Fixed a bug that was causing work order prices to sometimes show as [Object object]
* Facilities page: Facilities that have been create but not edited get deleted on page change
* Small view: Sidemenu disappears when an item is selected
* Updated areas and services to latest
* Added cross to close modal dialogues
* Profile pictures are now cropped to 1:1 aspect ratio
* Differentiated between services heading and subservices headings
* Added confirmation dialoge for remove from team function
* Changed to new logo with one less tier
* Small: Suppliers - All active modules now visible
* Small: Suppliers - Default value of work orders aligned

**v0.3.22a**

* Added confirmation dialog to deletions and reversals
* Finished close work order form

**v0.3.21a**

* Closing a work order with "further work required" checked creates a follow up work order
* Changes "step back" functionality for work orders
- New orders can be cancelled
- Orders issued but not exported can be deleted
- Orders issued and exported can be reversed, reversal creates a duplicate order with negative cost that can then be exported

**v0.3.20a**

* Individual work order links are now exposed to anyone with the link
* Block robots from indexing site (to protect privacy of exposed work orders)
* All services now closed and collapsed by default
* Supplier edit page : changed "default work order value" to material design style text input
* Added tool tip to file icons and image thumbnails
* Removed "not exported" filter
* Stopped auto-generation of test data, added "reset test data" option to settings menu for developers
* Changed appearance of file icons and image thumbnails (image full width, (x) to close, text semi transparent)
* "Close out work order" screen now autofills date and time and saves correctly

**v0.3.19a**

* Contacts sometimes absent on first load of portfolio (this will be due to non subscription)
* Nginx to move fm to port 80
* Create development and integration instances on AWS, separate deployments
* WO: File tab now shows actual number of files
* Table rows set to a consistent height of 50px
* Added descriptive text when inviting new users and suppliers
* Can now delete files and images
* Exporting of work orders
* Hook up with external email system

**v0.3.18a**

* WO: Fixed a bug that was causing chosen area to not appear until another item is also refreshed
* Dashboard temporarily disabled by default - index page is portfolio
* Added a check to prevent multiple sending of messages to individuals who have more than one role on a work order
* New messages now get forwarded to all team members
* Fixed a bug that was causing incorrect redirects on app entry
* Add deep linking for issues (so that the link can be sent in an email)

**v0.3.17a**

* Make discussions able to send messages
* Hook messages into nofications
* Insert check to ensure that notifications don't get sent to the same person multiple times
* Add notifications for posts on issues

**v0.3.16a**

* Move team into "Account settings" area
* Move account button and profile button into top right settings area
* Add messages button to left navigation bar
* Make messages page in style of issue details
* Updated implementation of discussions to facilitate new message system

**v0.3.15a**

* Upload/download documents feature
* View large image in popup feature

**v0.3.14a**

* Move notifications closer to right corner
* WO: Adjusted white space containers as per design elements
* WO: Adjusted tab display in line with image
* Tabs have animated underline as per MD
* WO: Uploaded files show as icons, uploaded images show as thumbnails

**v0.3.13a**

* Portolio - renamed Facility Holder to Facility Manager
* Team - Removed "about me" section
* Account - removed website, facebook, My headline, Short Bio, References fields
* Account - changed first "address 2" field to "Address 1"
* Medium - Edit profile/team member - First name and last name are in same row
* Small/med - submit/cancel buttons reconfigured - too large
* Fixed a bug that was preventing cancelling or creation of work orders
* WO : Fixed a bug that was causing "maximum call stack exceeded" error when trying to save issue description
* Fixed : "When first supplier added it dissappears, susequent suppliers seem to be added with no issue"
* Disabled permanent opening of issues created but not issued. There is now now situation where multiple issues will be open. (this also addressed the bug "WO: When issuing first order it doesn't close")
* Added autoscroll to fix "Screen should scroll to the top when clicking back on a link, eg WO from facilities. Currently it goes to the last position, eg at the end of the page."
* Facilities : Updated areas so that levels now appear in WO as specified in facility->areas


**v0.3.12a**

* WO: Changed the way tabs are sized to accomodate smaller views
* Changed the way contacts with avatars are displayed on smaller screens
* Centred the top logo so that it fits better on smaller screens and frees up the left area for a menu button
* Simplified the notifications and settings buttons so that they collapse better on smaller screens
* Moved the "facility selector" out of the left nav and into the pages that it is relevant to (wo and dash). This makes the layout less reliant on a persistent left nav
* Improved the animations for opening and shutting the left nav on larger screens
* Created a new style of "on canvas" left nav for smaller screens
* Changed the right nav so that it is more consistent on all screens
* Updated font and icon styles and sizes in left nav to make them more MD compliant
* Restyled notifications window for smaller screens
* Many other changes to WO stylesheets to improve responsiveness of layout

**v0.3.11a** 

* Fixed an issue that was causing WOs to crash when detail view opened by a contractor
* WO table: Fixed an issue that was causing sort by priorty to fail
* WO table: Added supplier column
* Fixed bug: "When test data is generated properties are sometimes allocated to FM Clarity team instead of Kaplan team"
* Fixed bug: "When create a new facility, enter no details, reload, then select new facility... card does not appear"
* Fixed an issue that was causing facilities to re-save when switching between them
* Made some changes to css presentation of work order details, facilities form, user form and account form to make them fit better on small screens

**v0.3.10a**

* WO: Available services and subservices are taken from facility configuration
* Team settings: Can configure services and subservices for contractor teams
* WO: Available contractors are determined by selected service and subservice

**v0.3.9a**

* Remove underscore prefix from fields in models
* Newly created facilities have areas and services
* Updated available areas array
* Areas and services ui now correctly updated when changing facilities

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
