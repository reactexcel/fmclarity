Meteor.publish('teams', function () {
	return Teams.find({"members._id":this.userId});
});

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
	issues = Issues.find({"team._id":{$in:teamIds}},{sort: {createdAt: -1}});
	return [teams,facilities,issues];
});

Meteor.publish("singleRequest",function(id){
	var request,facility,team;
	var cursors = [];
	var request = Issues.find({_id:id});
	var r = request.fetch();
	var fid = 0;
	var tid = 0;
	//console.log(r);
	if(r.facility) {
		fid = r.facility._id;
	}
	if(r.team) {
		tid = r.team._id;
	}
	facility = Facilities.find({_id:fid});
	team = Teams.find({_id:tid});
	return [request,facility,team];
});

Meteor.publish("contractors",function() {
	return Teams.find({type:"contractor"});
});
