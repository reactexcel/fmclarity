Schema = {};
FM = {
	version:"0.5.7a",
	collections:{},
	schemas:{}
}

function ucfirst(string) {
   	return string.charAt(0).toUpperCase() + string.slice(1);
}

// should be moved to schema based validation
FM.isValidEmail = function(email) {
    var temp = email.split('@');
    var name = temp[0];
    var server = temp[1];
    var validEmails = Config.validEmails;
	if(validEmails[server]&&((validEmails[server]=='*')||(validEmails[server].indexOf(name)>=0))) {
		return ucfirst(name);
	}
}

if(Meteor.isClient) {
	Session.setTeamRole = function(role) {
		return Session.set('selectedTeamRole',role);
	}
	Session.getTeamRole = function() {
		return Session.get('selectedTeamRole');
	}
	Session.getSelectedTeam = function() {
	    var selectedTeamQuery = Session.get('selectedTeam');
	    return Teams.findOne(selectedTeamQuery);
	}
	Session.selectTeam = function(team) {
	    if(team) {
	      Session.set('selectedTeam',{_id:team._id});
	    }
	    Session.set('selectedFacility',0);
    }
	Session.getSelectedFacility = function() {
	    var selectedFacilityQuery = Session.get('selectedFacility');
	    return Facilities.findOne(selectedFacilityQuery);
	}
	Session.selectFacility = function(f) {
	    if(f) {
	      Session.set('selectedFacility',{_id:f._id});
	    }
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