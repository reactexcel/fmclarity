Meteor.publish('teams', function () {
	return Teams.find({"members._id":this.userId});
});

Meteor.publish('allTeams', function() {
	return Teams.find();
})

Meteor.publish('config', function () {
    return Config.find({});
});

Meteor.publish('users', function () {
    return Users.find({});
});

Meteor.publish('facilities',function(){
	return Facilities.find();
});

Meteor.publish('teamsAndFacilitiesForUser', function () {
//probably should be ... Meteor.publish('teamsAndFacilitiesForUser', function (user) {
	//console.log('updating subscription');
	var teams, facilities, issues;

	teams = Teams.find({"members._id":this.userId});
	var teamIds = [];
	teams.forEach(function(t){
		teamIds.push(t._id);
	});
	facilities = Facilities.find({"team._id":{$in:teamIds}});
	issues = Issues.find({$or:[{"team._id":{$in:teamIds}},{"supplier._id":{$in:teamIds}}]},{sort: {createdAt: -1}});
	return [teams,facilities,issues];
});

Meteor.publish("singleRequest",function(id){
	var requests,facilities,teams;
	requests = Issues.find({_id:id});
	var facilityIds = [];
	requests.forEach(function(r){
		facilityIds.push(r.facility._id);
	})
	teams = Teams.find();
	facilities = Facilities.find({_id:{$in:facilityIds}});
	return [teams,facilities,requests];
});

Meteor.publish("contractors",function() {
	return Teams.find(/*{type:"contractor"}*/);
});
