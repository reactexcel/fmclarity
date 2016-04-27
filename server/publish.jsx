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

	//compile an array of the ids of all of the teams that the current member is in
	teams = Teams.find({"members._id":this.userId});
	var teamIds = [];
	var teamNames = [];
	teams.forEach(function(t){
		teamIds.push(t._id);
		teamNames.push(t.name);
	});
	//find all of the issues that are for those teams, either as a creator or a supplier
	issues = Issues.find({$or:[
		{"team._id":{$in:teamIds}},
		{"supplier._id":{$in:teamIds}},
		{"team.name":{$in:teamNames}},
		{"supplier.name":{$in:teamNames}},
	]},{sort: {createdAt: -1}});

	var facilityIds = [];
	var fetchedIssues = issues.fetch();
	fetchedIssues.map(function(i){
		if(i.facility&&i.facility._id) {
			facilityIds.push(i.facility._id);
		}
	})

	//find all of the facilities that are in those teams
	facilities = Facilities.find({$or:[
		{"team._id":{$in:teamIds}},
		{"_id":{$in:facilityIds}}
	]});

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
