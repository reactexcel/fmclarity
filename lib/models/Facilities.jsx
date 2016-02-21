Facilities.attachSchema(FacilitySchema);


Facilities.registerActions({
  wipeout:{
    method:function(facility){
      Facilities.remove(facility._id);
    },
    checkAccess(role,user,facility,args) {
      var team = Teams.findOne(facility.team._id);
      var role = RBAC.getRole(user,team);
      if(role=="manager") {
        return true;
      }
      return false;
    }
  },
  edit:{
    checkAccess(role,user,facility,args) {
      var team = Teams.findOne(facility.team._id);
      var role = RBAC.getRole(user,team);
      if(role=="manager") {
        return true;
      }
      return false;
    }
  }
});

// how would it be if these went in the schema?
// would make RBAC a lot easier
Facilities.helpers({
  getIssues() {
  	return Issues.find({"facility._id":this._id}).fetch();
  },
  setTeam(team) {
  	this.save({
  		team:{
  			_id:team._id,
  			name:team.name
  		}
  	})
  },
  getTeam() {
  	return Teams.findOne(this.team._id);
  },
  isNew() {
  	return this.name==null||this.name.length==0;
  },
  getName() {
  	//return this.name?(this.name+', '+this.address.city):'';
  	return this.name;
  },
  getAddress() {
  	var a = this.address;
  	return a.streetNumber+' '+a.streetName+' '+a.streetType+', '+a.city;
  },
  getAreas() {
  	var areas = [];
  	for(var areaGroupNum in this.areas) {
  		var areaGroup = this.areas[areaGroupNum];
  		var levelsLikeThis = parseInt(areaGroup.number);
  		for(var level=1;level<=levelsLikeThis;level++) {
	  		for(var areaNum in areaGroup.areas) {
	  			var area = areaGroup.areas[areaNum];
	  			var name = area.name;
	  			if(levelsLikeThis>1) {
	  				name = ('Level '+level+': ')+name;
	  			}
	  			areas.push({
	  				name:name
	  			});
	  		}
	  	}
  	}
  	return areas;
  },
  getAvailableServices(parent) {
  	var services = parent?parent.subservices:this.services;
  	var availableServices = [];
  	services.map(function(service){
  		if(service.available) {
  			availableServices.push(service);
  		}
  	});
  	return availableServices;
  },
  getPrimaryContact() {
    var contacts = this.getMembers({role:"contact"});
  	if(contacts&&contacts.length) {
      return contacts[0]
    }
  },
  getIssueCount() {
  	return Issues.find({"facility._id":this._id}).count();
  },
  getLocation() {
  	if(this.address) {
  		var a = this.address;
	  	return a.streetNumber+' '+a.streetName+', '+a.city;
	}
  },
  getBuildingAndLocation() {
  	if(this.address) {
  		return this.address.buildingName+'-'+this.getLocation();
  	}
  },
});

