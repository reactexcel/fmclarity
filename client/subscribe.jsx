/* this file should not exist, subscriptions should be on a page by page or component by component basis
 - rules for react component:
 1. if you use a resource, subscribe to it
 2. subscriptions should be coded to be as narrow as possible
 3. publications should be handled by controller */

var handle = Meteor.subscribe('teamsAndFacilitiesForUser');
Meteor.subscribe('users');

Tracker.autorun(function(){

	var user, team;
	if(handle.ready()){
		//console.log('checking team');
		var user = Meteor.user();
		if(user&&!Session.getSelectedTeam()) {
			team = user.getTeam(0);
			user.selectTeam(team);
		}
	}

})