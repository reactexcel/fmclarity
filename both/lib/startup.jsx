// REFACT: rename this file version and move respective client and server functions into "client" and "server" folders


Teams = ORM.Collection("Teams");
Issues = ORM.Collection("Issues");
Facilities = ORM.Collection("Facilities");
Users = ORM.Collection(Meteor.users);

//Should be called fileStore
Files = new FS.Collection("File", {
  stores: [new FS.Store.GridFS("master")]
});

Schema = {};
FM = {
	version:"1.3.15b",
	//We are already going ORM.Collection - couldn't this be handled there?
	collections:{
		'Teams':Teams,
		'Issues':Issues,
		'Facilities':Facilities,
		'Users':Users,
		'users':Users
	},
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
	return ucfirst(name);
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
	    if(selectedTeamQuery) {
		    return Teams.findOne(selectedTeamQuery._id);
		}
	}
	Session.selectTeam = function(team) {
	    if(team) {
	      Session.set('selectedTeam',{_id:team._id});
	    }
	    Session.set('selectedFacility',0);
    }
	Session.getSelectedFacility = function() {
	    var selectedFacilityQuery = Session.get('selectedFacility');
	    if(selectedFacilityQuery) {
		    return Facilities.findOne(selectedFacilityQuery._id);
		}
	}
	Session.selectFacility = function(f) {
	    if(f) {
	      Session.set('selectedFacility',{_id:f._id});
	    }
    }
	Session.getSelectedClient = function() {
	    var selectedClientQuery = Session.get('selectedClient');
	    if(selectedClientQuery) {
		    return Teams.findOne(selectedClientQuery._id);
		}
	}
	Session.selectClient = function(c) {
	    if(f) {
	      Session.set('selectedClient',{_id:c._id});
	    }
    }
}
else {

	Meteor.startup(function(){
		//perhaps should go in config?
		var smtpUsername = "AKIAIPJKWHGNFC75EL3Q";
		var smtpPassword = "AjuszCYXste2nI8Y8SrH+3vpo0+4lCJ0KA4HtBUAgd0m";
		process.env.ROOT_URL = 'https://app.fmclarity.com';
		process.env.MAIL_URL = "smtp://"+smtpUsername+":"+encodeURIComponent(smtpPassword)+"@email-smtp.us-west-2.amazonaws.com:465/";
	});

	FM.inDevelopment = function () {
  		return process.env.NODE_ENV === "development"||process.env.METEOR_ENV === "development";
	};
	FM.inProduction = function () {
  		return process.env.METEOR_ENV === "production";
	};
}