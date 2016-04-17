Facilities.schema(FacilitySchema);

DocThumb.register(Facilities,Files);

Facilities.methods({
  create:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:RBAC.lib.create.bind(Facilities)
  },
  save:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:RBAC.lib.save.bind(Facilities)
  },
  destroy:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:RBAC.lib.destroy.bind(Facilities)
  },
  addMember:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:RBAC.lib.addMember(Facilities,'members')
  },
  removeMember:{
    authentication:AuthHelpers.managerOfRelatedTeam,
    method:RBAC.lib.removeMember(Facilities,'members')
  }
})

// how would it be if these went in the schema?
// would make RBAC a lot easier
Facilities.helpers({
  getIssues() {
  	return Issues.find({"facility._id":this._id}).fetch();
  },
  getTeam() {
    return Teams.findOne(this.team._id);
  },  
  setTeam(team) {
  	this.save({
  		team:{
  			_id:team._id,
  			name:team.name
  		}
  	})
  },
  isNew() {
  	return this.name==null||this.name.length==0;
  },
  getName() {
  	//return this.name?(this.name+', '+this.address.city):'';
  	return this.name;
  },
  getAddress() {
    var str = '';
  	var a = this.address;
    if(a) {
      str = a.streetNumber+
      ' '+a.streetName+
      ' '+a.streetType+
      (a.city?(', '+a.city):null);
    }
    return str;
  },
  getAreas() {
  	var areas = [];
  	for(var areaGroupNum in this.areas) {
  		var areaGroup = this.areas[areaGroupNum];
  		var levelsLikeThis = parseInt(areaGroup.data?areaGroup.data.number:1);
  		for(var level=1;level<=levelsLikeThis;level++) {
	  		for(var areaNum in areaGroup.children) {
	  			var area = areaGroup.children[areaNum];
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
  	var services = parent?parent.children:this.services;
  	var availableServices = [];
  	services?services.map(function(service){
  		if(service.active) {
  			availableServices.push(service);
  		}
  	}):null;
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

