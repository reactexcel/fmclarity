
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
	}
};

Contact = {
}

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
}

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
		label:"Nank name",
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
    	label:"Building areas",
    	input:"select",
    },
    services: {
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