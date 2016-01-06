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
* Make discussions able to send messages
* Hook messages into nofications
* Insert check to ensure that notifications don't get sent to the same person multiple times
* Add notifications for posts on issues

IN PROGRESS
-----------
* There is an error where chosen area does not appear until another item is also refreshed
* Hook up with external email system
* New invites should send a message using new message system
* Add team messaging features

* Add deep linking to issues (so that the link can be sent in an email)
* Add facility contact to watchers
* Add descriptive text when inviting new users and suppliers
* SSL
* Create development and integration instances on AWS, separate deployments
* Put fmclarity in integration instance
* Finish "close out work order" screen

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
