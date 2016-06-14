//These publish functions need to be moved into their respective controllers

Meteor.publish('teams', function () {
	return Teams.find({"members._id":this.userId});
});

Meteor.publish('allTeams', function() {
	return Teams.find();
})

Meteor.publish('users', function () {
    return Users.find({});
});

Meteor.publish('suppliersForTeam',function(teamId,numSuppliers){
	var team = Teams.findOne(teamId);
	var supplierIds = [];

	if(team.suppliers&&team.suppliers.length) {
		team.suppliers.map(function(s) {
			supplierIds.push(s._id);
		})
	}

	return Teams.find({_id:{$in:supplierIds}},{sort:{name:1,_id:1},limit:numSuppliers});
});

Meteor.publish('teamsAndFacilitiesForUser', function () {
//probably should be ... Meteor.publish('teamsAndFacilitiesForUser', function (user) {
	//console.log('updating subscription');
	var teams, facilities, issues, suppliers;

	//teams I am a member in
	teams = Teams.find({"members._id":this.userId});
	var teamIds = [];
	var teamNames = [];
	//var supplierIds = [];
	teams.forEach(function(t){
		teamIds.push(t._id);
		teamNames.push(t.name);
		//need to see all suppliers of our teams as well
		//if(t.suppliers&&t.suppliers.length) {
			//t.suppliers.map(function(s) {
				//supplierIds.push(s._id);
			//})
		//}
	});

	//suppliers = Teams.find({_id:{$in:supplierIds}});

	//console.log('looked again');

	//find all of the issues that are for those teams, either as a creator or a supplier
	issues = Issues.find({$or:[
		{$or:[
			{"team._id":{$in:teamIds}},
			{"team.name":{$in:teamNames}}
		]},
		{$and:[
			{$or:[{"supplier._id":{$in:teamIds}},{"supplier.name":{$in:teamNames}}]},
			{status:{$nin:[Issues.STATUS_DRAFT,Issues.STATUS_NEW]}}
		]}
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
	return Teams.find({},{sort:{name:1,_id:1}});
});
