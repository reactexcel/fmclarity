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
* Move team into "Account settings" area
* Move account button and profile button into top right settings area
* Add messages button to left navigation bar
* Make messages page in style of issue details

[ 
- Discussion [Post, Comment]: a converstion with multiple watchers that can be hosted on a node such as a work order or facility 
- Notification : a system log
- Message : a message to an individual person which may or may not be emailed
]

[[Move discussion and notification system out into their own Meteor modules with separate unit tests and the like]]

* Add separate discussion element to work order
* Make discussions able to send messages



IN PROGRESS
-----------
* Create messages views for messages page
* Add create new message functionality
* Hook up with external email system
* Make notifications able to send messages
* Settings to go in left navigation on small screens

NOTES
-----
* Need a mixin that is used by both user and team which includes, among other things, a receive function that is called when the entity should receive a message

BUGS
----
* When opening app on small size - large left navigation is retained and broken
