var handle = Meteor.subscribe('teamsAndFacilitiesForUser');

Tracker.autorun(function(){

	var user, team;
	if(handle.ready()){
		console.log('checking team');
		var user = Meteor.user();
		if(user&&!user.getSelectedTeam()) {
			team = user.getTeam(0);
			user.selectTeam(team);
		}
	}

})