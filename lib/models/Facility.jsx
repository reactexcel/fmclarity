
// labels need i18n
Address = {
	streetNumber:{
		label:"Street number",
		size:3
	},
	streetName:{
		label: "Street name",
		size:6
	},
	streetType:{
		label: "Street name",
		size:3
	},
	city:{
		label:"City",
    	defaultValue: "",
		size:6,
	},
	state:{
		label:"State",
		size:3,
	},
	postcode:{
		label:"Postcode",
		size:3
	}
};

Contact = {
};

FacilityManager = {
	type:{
		label:"Type",
	},
	companyName : {
		label:"Company name",
		size:6,
	},
	abn:{
		label:"ABN",
		size:6
	},
	contactName: {
		label:"Contact name",
	},
	phone:{
		label:"Phone",
		size:6
	},
	email:{
		label:"Email",
		size:6
	},
	address:{
		type:Object,
		label:"Address",
		schema:Address,
	},
};

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
};

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

Lease = {
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
};

Facilities = FM.createCollection('Facility',{
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
    	type:Object,
    	schema:FacilityManager
    },
    address:{
    	type:Object,
    	label:"Address",
    	schema:Address,
    },
    lease:{
    	type:Object,
    	schema:Lease,
    },
    team: {
    	label: "Team query object",
    },
    contacts : {
    	type: [Object],
    	label: "Tenants"
    },
    tenants : {
    	type: [Object],
    	label: "Tenants"
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
},true);

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
  addContact(contact) {
  	this.contacts.push({
        _id:contact._id,
        name:contact.name,
        phone:contact.phone,
        email:contact.email
  	});
  	this.save();
  },
  getContacts() {
    if (this.contacts&&this.contacts.length) {
    	// this is pretty fucking inefficient
    	// idea - store contactIds and sometimes denormalise by making contacts as well
    	// perhaps if contacts is empty or if it has "expired"
      var users = this.contacts;
      var userIds = [];
      users.map(function(user){
        if(user&&user._id) {
          userIds.push(user._id);
        }
      });
      return Users.find({_id:{$in:userIds}}).fetch();
    }
    return [];

  },
  getTenants() {
    if (this.tenants&&this.tenants.length) {
    	// this is pretty fucking inefficient
    	// idea - store tenantIds and sometimes denormalise by making tenants as well
    	// perhaps if tenants is empty or if it has "expired"
    	var tenants = this.tenants;
    	var tenantIds = [];
    	tenants.map(function(contact){
        if(contact&&contact._id) {
      		tenantIds.push(contact._id);
        }
    	});
    	return Users.find({_id:{$in:tenantIds}}).fetch();
    }
    return [];

  },
  getPrimaryContact() {
  	var id=0;
  	if(this.contacts&&this.contacts.length) {
	  	id = this.contacts[0]._id;
    }
  	if(id) {
  		return Users.findOne(id);
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

