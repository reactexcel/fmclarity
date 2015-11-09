Meteor.publish('teams', function () {
	return Teams.find({_members:{_id:this.userId}});
});

Meteor.publish('teamsAndFacilitiesForUser', function () {
	console.log('updating subscription');
	var teams, facilities, issues;

	teams = Teams.find({_members:{_id:this.userId}});
	var teamIds = [];
	teams.forEach(function(t){
		teamIds.push(t._id);
	});
	facilities = Facilities.find({"_team._id":{$in:teamIds}});
	issues = Issues.find({"_team._id":{$in:teamIds}});
	return [teams,facilities,issues];
});
