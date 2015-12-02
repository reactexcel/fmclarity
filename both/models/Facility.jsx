
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

FacilityHolder = {
	type:{
		label:"Holder type",
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
		type:Object,
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
		type:Object,
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
    thumb: {
    	label:"Thumbnail file",
    	defaultValue:["img/default-placeholder.png"]
    },
    holder: {
    	type:Object,
    	schema:FacilityHolder
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
    _team: {
    	label: "Team query object",
    },
    _tenants : {
    	type: [Object],
    	label: "Tenants"
    },
    areas: {
    	type:[Object],
    	label:"Building areas",
    	input:"select",
    },
    services: {
    	type:[Object],
    	label:"Building services",
    	input:"select",
    }
},true);

Facilities.helpers({
  getIssues() {
  	return Issues.find({"_facility._id":this._id}).fetch();
  },
  getTeam() {
  	return Teams.findOne(this._team);
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
  	for(var i in this.areas) {
  		if(i=='Unique areas') {
  			areas.push(this.areas[i].areas[j]);
  		}
  		else {
	  		for(var j in this.areas[i].areas) {
	  			areas.push({
	  				name:('Level 1: '+this.areas[i].areas[j].name)
	  			});
	  		}
	  		for(var j in this.areas[i].areas) {
	  			areas.push({
	  				name:('Level 2: '+this.areas[i].areas[j].name)
	  			});
	  		}
	  	}
  	}
  	return areas;
  },
  getContacts() {
    if (this._contacts&&this._contacts.length) {
    	// this is pretty fucking inefficient
    	// idea - store contactIds and sometimes denormalise by making contacts as well
    	// perhaps if contacts is empty or if it has "expired"
    	var contacts = this._contacts;
    	var contactIds = [];
    	contacts.map(function(contact){
    		contactIds.push(contact._id);
    	});
    	return Users.find({_id:{$in:contactIds}}).fetch();
    }
    return [];

  },
  getIssueCount() {
  	return Issues.find({"_facility._id":this._id}).count();
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

ExampleFacilities = [
	{
		name:"Docklands",
		location:"Clarence Street, Sydney",
		address:{
			streetNumber:"370",
			streetName:"Docklands",
			streetType:"Drive",
			city:"Docklands",
			state:"VIC",
			country:"Australia",
			buildingName:"Docklands",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/370 Docklands.jpg","img/floor-plan.jpg"],
	},
	{
		name:"Hay St, Perth",
		location:"Clarence Street, Sydney",
		address:{
			streetNumber:"1525",
			streetName:"Hay",
			streetType:"Street",
			city:"Perth",
			state:"WA",
			country:"Australia",
			buildingName:"Hay St, Perth",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/1525 hay.jpg","img/floor-plan.jpg"],
	},
	{
		name:"S Steyne St, Sydney",
		location:"Clarence Street, Sydney",
		address:{
			streetNumber:"30/32",
			streetName:"S Steyne",
			streetType:"Street",
			city:"Sydney",
			state:"NSW",
			country:"Australia",
			buildingName:"S Steyne St, Sydney",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/30-32 S Steyne.jpg","img/floor-plan.jpg"],
	},
	{
		name:"George St, Sydney",
		location:"Clarence Street, Sydney",
		address:{
			streetNumber:"Level 8, 540",
			streetName:"George",
			streetType:"Street",
			city:"Sydney",
			state:"NSW",
			country:"Australia",
			buildingName:"George St, Sydney",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/30-32 S Steyne.jpg","img/floor-plan.jpg"],
	},
	{
		name:"Macquarie Park",
		location:"Clarence Street, Sydney",
		address:{
			streetNumber:"Level 5, 4",
			streetName:"Drake",
			streetType:"Avenue",
			city:"Macquarie Park",
			state:"NSW",
			country:"Australia",
			buildingName:"Macquarie Park",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/4 drake.jpg","img/floor-plan.jpg"],
	},
	{
		name:"Goulburn St, Sydney",
		location:"Clarence Street, Sydney",
		address:{
			streetNumber:"98-104",
			streetName:"Goulburn",
			streetType:"Street",
			city:"Sydney",
			state:"NSW",
			country:"Australia",
			buildingName:"Goulburn St, Sydney",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/98-104 goulburn.jpg","img/floor-plan.jpg"],
	},
	{
		name:"Murdoch Institute of Technology",
		location:"South Street, Murdoch",
		address:{
			streetNumber:"",
			streetName:"South",
			streetType:"Street",
			city:"Murdoch",
			state:"WA",
			country:"Australia",
			buildingName:"Murdoch Institute of Technology",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/Murdoch.jpg","img/floor-plan.jpg"],
	},
	{
		name:"Osbourne Park",
		_name:"Franklin Scholar",
		location:"Hasler Rd, Osbourne Park",
		address:{
			streetNumber:"1/76",
			streetName:"Hasler",
			streetType:"Road",
			city:"Osbourne Park",
			state:"WA",
			country:"Australia",
			buildingName:"Franklin Scholar",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/76 Hasler.jpg","img/floor-plan.jpg"],
	},
	{
		name:"Cantebury",
		_name:"Franklin Scholar",
		location:"Shierlaw Ave, Cantebury",
		address:{
			streetNumber:"21",
			streetName:"Shierlaw",
			streetType:"Avenue",
			city:"Canterbury",
			state:"VIC",
			country:"Australia",
			buildingName:"Franklin Scholar",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/21 Shierlaw.jpg","img/floor-plan.jpg"],
	},
	{
		name:"Launceston",
		_name:"Franklin Scholar",
		location:"Cameron St, Launceston",
		address:{
			streetNumber:"65",
			streetName:"Cameron",
			streetType:"Street",
			city:"Launceston",
			state:"TAS",
			country:"Australia",
			buildingName:"Franklin Scholar",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/65 cameron.jpg","img/floor-plan.jpg"],
	},
	{
		name:"Hobart",
		_name:"Franklin Scholar",
		location:"Warwick St, Hobart",
		address:{
			streetNumber:"12",
			streetName:"Warwick",
			streetType:"Street",
			city:"Hobart",
			state:"TAS",
			country:"Australia",
			buildingName:"Franklin Scholar",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/12 Warwick.jpg","img/floor-plan.jpg"],
	},
	{
		name:"Peel St, Adelaide",
		_name:"Professional & International English",
		location:"Peel St, Adelaide",
		address:{
			streetNumber:"22",
			streetName:"Peel",
			streetType:"Street",
			city:"Adelaide",
			state:"SA",
			country:"Australia",
			buildingName:"Professional & International English",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/22 Peel St, adelaide.jpg","img/floor-plan.jpg"],
	},
	{
		name:"Spring Hill",
		_name:"Professional & International English",
		location:"St Pauls Terrace, Spring Hill",
		address:{
			streetNumber:"252",
			streetName:"Pauls",
			streetType:"Terrace",
			city:"Spring Hill",
			state:"QLD",
			country:"Australia",
			buildingName:"Professional & International English",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/252 st pauls.jpg","img/floor-plan.jpg"],
	},
	{
		name:"Cairns",
		_name:"Professional & International English",
		location:"McLeod St, Cairns",
		address:{
			streetNumber:"130",
			streetName:"McLeod",
			streetType:"Street",
			city:"Cairns",
			state:"QLD",
			country:"Australia",
			buildingName:"Professional & International English",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/130 MacLeod.jpg","img/floor-plan.jpg"],
	},
	{
		name:"Grenfell St, Adelaide",
		_name:"Bradford College",
		location:"Grenfell St, Adelaide",
		address:{
			streetNumber:"132",
			streetName:"Grenfell",
			streetType:"Street",
			city:"Adelaide",
			state:"SA",
			country:"Australia",
			buildingName:"Bradford College",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:["img/132 Grenfell St.jpg","img/floor-plan.jpg"],
	}
];