Schema = {};
FM = {
	version:"0.3.26a",
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

FM.create = function(collectionName,item,callback) {
	var collection = FM.collections[collectionName];
	Meteor.call(collectionName+'.new',item,null,function(err,id){
		FM.notify("created",{
			collectionName:collectionName,
			_id:id
		});
		if(callback) {
			callback(collection.findOne({_id:id}));
		}
	});
}