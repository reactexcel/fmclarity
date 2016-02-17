Schema = {};
FM = {
	version:"0.4.2a",
	collections:{},
	schemas:{}
}

if(Meteor.isClient) {
	FM.getSelectedTeam = function() {
	    var selectedTeamQuery = Session.get('selectedTeam');
	    return Teams.findOne(selectedTeamQuery);
	}
	FM.getSelectedFacility = function() {
	    var selectedFacilityQuery = Session.get('selectedFacility');
	    return Facility.findOne(selectedFacilityQuery);
	}
}
else {
	FM.inDevelopment = function () {
  		return process.env.NODE_ENV === "development"||process.env.METEOR_ENV === "development";
	};
	FM.inProduction = function () {
  		return process.env.METEOR_ENV === "production";
	};
}