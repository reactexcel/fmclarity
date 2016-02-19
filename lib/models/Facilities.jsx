Insurance = {
	insurer:{
		label:"Insurer",
		size:6
	},
	policyNumber:{
		label:"Policy number",
		size:6
	},
	sumInsured:{
		label:"Sum insured",
		size:6
	},
	expiry:{
		label:"Expiry",
		size:6
	},
	documents:{
		label:"Insurance documents",
		//input:"attachment",
	},
}

SecurityDeposit = {
	purpose:{
		label:"Purpose",
	},
	amountRequired:{
		label:"Amount required",
		size:6,
	},
	amountHeld:{
		label:"Amount held",
		size:6,
	},
	bankName:{
		label:"Bank name",
		size:6,
	},
	reviewDate:{
		label:"Review date",
		size:6,
	},
	favoureeName:{
		label:"Favouree name",
	},
	originalHeldBy:{
		label:"Original held by"
	}
}

Parking = {  
    permanent:{
    	label:"Permanent",
    	size:6
    },
    temporary:{
    	label:"Temporary",
    	size:6
    },
}

LeaseSchema = {
    commencement: {
    	label:"Lease commencement",
    	size:6
    },
    expiry: {
    	label:"Lease expiry",
    	size:6
    },
    landlordExecuted: {
    	label:"Landlord executed",
    	input:"switch",
    	size:6
    },
    tenantExecuted: {
    	label:"Tenant executed",
    	input:"switch",
    	size:6
    },
	documents:{
		label:"Lease documents",
		//input:"attachment",
	},
    parking: {
    	label:"Parking",
    	schema:Parking,
    },
    insuranceDetails: {
    	label:"Insurance details",
    	schema:Insurance
    },
    securityDeposit: {
    	label:"Security deposit",
    	schema:SecurityDeposit
    }
}

FacilitySchema = {
    name: {
    	label: "Name",
    	defaultValue: "",
    },
    type: {
    	label:"Property type",
    	size:6
    },
    size: {
    	label:"Net lettable area (m²)",
    	size:6
    },
    description: {
    	label: "Description",
    	input:"mdtextarea",
    },
    attachments: {
    	type:[Object],
    	label:"Attachments",
    	input:"attachments"
    },
    manager: {
    	schema:FacilityManagerSchema
    },
    address:{
    	label:"Address",
    	schema:AddressSchema,
    },
    lease:{
    	schema:LeaseSchema,
    },
    team: {
    	label: "Team query object",
    },
    members : {
      label: "Members",
      type: [Object],
      relationship:{
        "hasMany":Users
      },
    },
    contacts : {
      label: "Contacts",
    	type: [Object],
      relationship:{
        "hasMany":Users
      },
    },
    tenants : {
      label: "Tenants",
    	type: [Object],
      relationship:{
        "hasMany":Users
      },
    },
    areas: {
    	type:[Object],
    	label:"Building areas",
    	input:"select",
    	defaultValue:function(){
        	return JSON.parse(JSON.stringify(Config.defaultAreas));
    	}
    },
    services: {
    	type:[Object],
    	label:"Building services",
    	input:"select",
    	defaultValue:function(){
        	return JSON.parse(JSON.stringify(Config.services));
    	}
    }
}

Facilities.attachSchema(FacilitySchema);

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

