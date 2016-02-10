ROADMAP.md
==========

DONE
----

REFACTOR
--------
* Create mixin for card behaviour shown in Facility, User, Team
* Rename inconsistent items, decide on taxonomy and document it
* if (post.validate()) {// Update document with with only the fields that have changed.post.save();}
* Autoform should be moved into separate Meteor module
* Autoform should have template option (used for things like the work order)
* Need a mixin that is used by both user and team which includes, among other things, a receive function that is called when the entity should receive a message
* Need a pre commit hook to run automated tests and a post commit hook to do a mup deploy