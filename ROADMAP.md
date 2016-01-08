ROADMAP.md
==========

TODO (general)
--------------
* Brainstorm list of "actions" for RBAC inc[create facility, add to team, create contact, add to team, edit own profile, edit other profile]
* Tidy folder structure and create component dictionary 
* Write test plan [login, click through each screen, create a work order, invote a user to a team]
* Need a pre commit hook to run automated tests and a post commit hook to do a mup deploy

DONE
----

IN PROGRESS
-----------
* Hook up with external email system
* Writing on issue updates should send a notification to all watchers
* Add facility contact to watchers
- watchers check moved to model
- watchers sent to "News Feed" component

* Exporting of work orders

* Fix up presentation of facility card
* Add "create work order" link to facility card

* Add descriptive text when inviting new users and suppliers
* Nginx to move fm to port 80 (or is there a quicker way?)
* Create development and integration instances on AWS, separate deployments
* Finish "close out work order" screen
* Put fmclarity in integration instance
* Contacts sometimes absent on first load of portfolio (this will be due to non subscription)

* Add SSL

P2
--
* Suppliers - remove from team to be put into "actions" menu"
* It is possible for a user to remove themselves from all team, resulting in app crash
* Small - facilities area selector - south/north field is too compressed whereas descriptor has excess room
* Small - Facilities services, when you select frequency, eg weekly, a second instance of weekly appears below the entered field
* Small - Facilities services item title fields don't wrap text next to toggle, only under it
* Small - facilities - Property contact details not fully visible, perhaps wrap to another line?
* Small - Supplier - insert logo inserts it in between email and website
* Small - Suppliers - All active modules not visible, default value of work orders not aligned

P3
--
* New invites should send a message using new message system
* Suppliers - remove from team: confirmation dialog required
* Avatar for Leo squished as per attached screenshot
* Change Security deposit header to security deposit/bank guarantee and insert a field to choose which it is. For SD only require the fields amount required, amount held, and held by. the other fields are for bank guarantee. This should be trackable too, ie reported on
* Add Fields under lease detail - Lessor/managing agent and contact number and email, annual review date, review method (select Fixed %(% value)/CPI/fixed amount ($ value), market review date
* Add detail to supplier card as per pdf screen attached
* Link dash elements to actual activity - change ABC graph to work order type (like a vertical bar graph)
* Notifications should clear for each user once they have viewed items for say 5 seconds, same for numbered shields on say images and updates
* The system currently allows you to hit new facility, not enter anything and then it will save it with no details. If nothing is entered then it should discard on change of screen
* Small - facilities - move new button left (or reconfigure in line with task 83) 
* Small - add Work Orders header
* WO - auto scroll to block column header
* Settings to go in left navigation on small screens
* Change feed to inbox
* Change post to message
* Include work request type, eg preventative maintenance, ad-hoc, base building, warranty, contract, no-cost - these can be top level service types

NOTES
-----
* Need a mixin that is used by both user and team which includes, among other things, a receive function that is called when the entity should receive a message

BUGS
----
* When opening app on small size - large left navigation is retained and broken
