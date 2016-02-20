Schema = {};
FM = {
	version:"0.4.2a",
	collections:{},
	schemas:{}
}

function ucfirst(string) {
   	return string.charAt(0).toUpperCase() + string.slice(1);
}

FM.isValidEmail = function(email) {
    var temp = email.split('@');
    var name = temp[0];
    var server = temp[1];
    var validEmails = Config.validEmails;
	if(validEmails[server]&&((validEmails[server]=='*')||(validEmails[server].indexOf(name)>=0))) {
		return ucfirst(name);
	}
}

FM.throwError = function(error, reason, details) {  
	var meteorError = new Meteor.Error(error, reason, details);
	if (Meteor.isClient) {
		return meteorError;
	} else if (Meteor.isServer) {
		throw meteorError;
	}
}

FM.throwWarning = function(warning, reason, details) {
	
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