Teams = ORM.Collection("Teams");
Issues = ORM.Collection("Issues");
Facilities = ORM.Collection("Facilities");
Users = ORM.Collection(Meteor.users);
//Should be called fileStore
Files = new FS.Collection("File", {
  stores: [new FS.Store.GridFS("master")]
});

if(Meteor.isClient) {
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
}