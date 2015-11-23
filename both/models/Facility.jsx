
// labels need i18n
Address = {
	streetNumber:{
		label:"Street number",
		size:3
	},
	streetName:{
		label: "Street name",
		size:9
	},
	city:{
		label:"City",
		size:6,
	},
	state:{
		label:"State",
		size:3,
	},
	postcode:{
		label:"Postcode",
		size:3
	},
	buildingName:{
		label:"Building name",
		size:12,
	},
	buildingDirections:{
		label:"Directions",
		size:12,
		input:"mdtextarea",
	}
};

Contact = {
	phone:{
		label:"Phone",
	},
	email:{
		label:"Email",
	},
	name:{
		label:"Name",
	}	
}

FacilityClient = {
	type:{
		label:"Client type",
	},
	name : {
		label:"Client name",
	},
	abn:{
		label:"Client ABN"
	},
	address:{
		type:Object,
		label:"Client address",
		schema:Address,
	},
	contact:{
		type:Object,
		label:"Contact",
		schema:Contact
	}
}

Lease = {
    leaseCommencement: {
    	label:"Lease commencement",
    	size:6
    },
    leaseExpiry: {
    	label:"Lease expiry",
    	size:6
    },
    tenancyInsuranceExpiry:{
    	label:"Tenancy insurance expiry",
    	size:6
    },
    permanentParking:{
    	label:"Permanent parking",
    	size:6
    },
    temporaryParking:{
    	label:"Temporary parking",
    	size:6
    }	
};

Facilities = FM.createCollection('Facility',{
    name: {
    	label: "Name",
    },
    type: {
    	label:"Property type",
    },
    size: {
    	label:"Net lettable area (m²)"
    },
    description: {
    	label: "Description",
    	input:"mdtextarea",
    },
    thumb: {
    	label:"Thumbnail file",
    },
    client: {
    	type:Object,
    	schema:FacilityClient
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
    buildingAreas: {
    	label:"Areas",
    	input:"custom",
		options:{
			containerStyle:{height:"300px"}
		}
    },
    buildingServices: {
    	label:"Services",
    	input:"custom",
		options:{
			containerStyle:{height:"300px"}
		}
    }
},true);

Facilities.helpers({
  getIssues() {
  	return Issues.find({"_facility._id":this._id}).fetch();
  },
  getTeam() {
  	return Teams.findOne(this._team);
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
		name:"Head Office",
		location:"Clarence Street, Sydney",
		address:{
			streetNumber:"4/45",
			streetName:"Clarence",
			streetType:"St",
			city:"Sydney",
			state:"NSW",
			country:"Australia",
			buildingName:"Head Office",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-2.jpg",
		contact:{
			name:"Pamela Jones",
			thumb:"a1.jpg",
			email:"pj@notmail.net",
			phone:"0434-143-324"
		}
	},
	{
		name:"Franklin Scholar",
		location:"Hasler Rd, Osbourne Park",
		address:{
			streetNumber:"1/76",
			streetName:"Hasler",
			streetType:"Rd",
			city:"Osbourne Park",
			state:"WA",
			country:"Australia",
			buildingName:"Franklin Scholar",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"John Smith",
			thumb:"a1.jpg",
			email:"johnny@big.net",
			phone:"0444-123-321"
		}
	},
	{
		name:"Franklin Scholar",
		location:"Shierlaw Ave, Cantebury",
		address:{
			streetNumber:"21",
			streetName:"Shierlaw",
			streetType:"Ave",
			city:"Canterbury",
			state:"VIC",
			country:"Australia",
			buildingName:"Franklin Scholar",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"John Smith",
			thumb:"a1.jpg",
			email:"johnny@big.net",
			phone:"0444-123-321"
		}
	},
	{
		name:"Franklin Scholar",
		location:"Cameron St, Launceston",
		address:{
			streetNumber:"65",
			streetName:"Cameron",
			streetType:"St",
			city:"Launceston",
			state:"TAS",
			country:"Australia",
			buildingName:"Franklin Scholar",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"John Smith",
			thumb:"a1.jpg",
			email:"johnny@big.net",
			phone:"0444-123-321"
		}
	},
	{
		name:"Franklin Scholar",
		location:"Warwick St, Hobart",
		address:{
			streetNumber:"12",
			streetName:"Warwick",
			streetType:"St",
			city:"Hobart",
			state:"TAS",
			country:"Australia",
			buildingName:"Franklin Scholar",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"John Smith",
			thumb:"a1.jpg",
			email:"johnny@big.net",
			phone:"0444-123-321"
		}
	},
	{
		name:"Professional & International English",
		location:"Peel St, Adelaide",
		address:{
			streetNumber:"22",
			streetName:"Peel",
			streetType:"St",
			city:"Adelaide",
			state:"SA",
			country:"Australia",
			buildingName:"Professional & International English",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-3.jpg",
		contact:{
			name:"Neelix Ralph",
			thumb:"a1.jpg",
			email:"nralph@email.com",
			phone:"0423-333-313"
		}
	},
	{
		name:"Professional & International English",
		location:"St Pauls Terrace, Spring Hill",
		address:{
			streetNumber:"252",
			streetName:"Pauls",
			streetType:"Tce",
			city:"Spring Hill",
			state:"QLD",
			country:"Australia",
			buildingName:"Professional & International English",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-4.jpg",
		contact:{
			name:"Harry Arogula",
			thumb:"a1.jpg",
			email:"haro@memail.com",
			phone:"0444-444-324"
		}
	},
	{
		name:"Professional & International English",
		location:"McLeod St, Cairns",
		address:{
			streetNumber:"130",
			streetName:"McLeod",
			streetType:"St",
			city:"Cairns",
			state:"QLD",
			country:"Australia",
			buildingName:"Professional & International English",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"Gary Hardman",
			thumb:"a1.jpg",
			email:"hardman@email.com",
			phone:"0414-111-111"
		}
	},
	{
		name:"Bradford College",
		location:"Grenfell St, Adelaide",
		address:{
			streetNumber:"132",
			streetName:"Grenfell",
			streetType:"St",
			city:"Adelaide",
			state:"SA",
			country:"Australia",
			buildingName:"Bradford College",
		},
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		thumb:"building-1.jpg",
		contact:{
			name:"Johnny Smithy",
			thumb:"a1.jpg",
			email:"js@email.com",
			phone:"0414-111-111"
		}
	}
];