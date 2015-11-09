FM = {};
FM.selected = {};

FM.selectTeam = function(team) {
	Session.set('selectedTeam',team);
	Session.set('selectedFacility',0);
}

FM.getSelectedTeam = function() {
	var team = Session.get('selectedTeam');
	if(team&&team._id) {
		return Teams.findOne(team._id);
	}
	
}

FM.selectFacility = function(facility) {
	Session.set('selectedFacility',facility);
}

FM.getSelectedFacility = function() {
	var facility = Session.get('selectedFacility');
	if(facility&&facility._id) {
		return Facilities.findOne(facility._id);
	}
}