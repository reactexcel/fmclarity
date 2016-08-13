if(Meteor.isClient) {
	Meteor.subscribe('teamsAndFacilitiesForUser');
	Meteor.subscribe('users');
}