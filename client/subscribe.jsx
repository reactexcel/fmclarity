var handle = Meteor.subscribe('teamsAndFacilitiesForUser');

Tracker.autorun(function(){
	if(handle.ready()){
		if(Meteor.user()) {
			var team = Meteor.user().getTeam(0);
			Meteor.user().selectTeam(team);
		}
	}
})