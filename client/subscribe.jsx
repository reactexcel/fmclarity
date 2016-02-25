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