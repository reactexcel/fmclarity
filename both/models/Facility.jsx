
Facilities = FM.createCollection('Facility',{
    name: {
    	type: String,
    	label: "Name",
    },
    address: {
    	type: String,
    	label: "Address",
    	size:6,
    },
    location: {
    	type: String,
    	label: "Location",
    	size:6,
    },
    description: {
    	type: String,
    	label: "Description",
    	input:"mdtextarea",
    },
    thumb: {
    	type:String,
    	label:"Thumbnail file",
    },
    addressLine1 :{
    	type: String,
    	label: "Address line 2",
    	size:6,
    },
    addressLine2 :{
    	type: String,
    	label: "Address line 2",
    	size:6
    },
    city :{
    	type: String,
    	label: "City/Suburb",
    	size:3
    },
    state :{
    	type: String,
    	label: "State",
    	size:3
    },
    country :{
    	type: String,
    	label: "Country",
    	size:3
    },
    postcode :{
    	type: String,
    	label: "Postcode/ZIP",
    	size:3,
    },
    _team: {
    	type: Object,
    	label: "Team query object",
    },
    "_team._id": {
    	type:String,
    	label:"Team id"
    },
    buildingAreas: {
    	type:String,
    	label:"Areas",
    	input:"custom",
		options:{
			containerStyle:{height:"300px"}
		}
    },
    buildingServices: {
    	type:String,
    	label:"Services",
    	input:"custom",
		options:{
			containerStyle:{height:"300px"}
		}
    },
    leaseCommencement: {
    	type:String,
    	label:"Lease commencement",
    	size:6
    },
    leaseExpiry: {
    	type:String,
    	label:"Lease expiry",
    	size:6
    },
    tenancyInsuranceExpiry:{
    	type:String,
    	label:"Tenancy insurance expiry",
    	size:6
    },
    permanentParking:{
    	type:String,
    	label:"Permanent parking",
    	size:6
    },
    temporaryParking:{
    	type:String,
    	label:"Temporary parking",
    	size:6
    },

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
  }
});

ExampleFacilities = [
	{
		name:"Head Office",
		address:"4/45 Clarence Street, Sydney",
		location:"Clarence Street, Sydney",
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
		address:"1/76 Hasler Rd, Osbourne Park, WA",
		location:"Hasler Rd, Osbourne Park",
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
		address:"21 Shierlaw Ave, Canterbury, VIC",
		location:"Shierlaw Ave, Cantebury",
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
		address:"65 Cameron St, Launceston, TAS",
		location:"Cameron St, Launceston",
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
		address:"12 Warwick St, Hobart, TAS",
		location:"Warwick St, Hobart",
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
		address:"22 Peel St",
		location:"Peel St, Adelaide",
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
		address:"252 St Pauls Terrace, Spring Hill",
		location:"St Pauls Terrace, Spring Hill",
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
		address:"130 McLeod St, Cairns",
		location:"McLeod St, Cairns",
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
		address:"132 Grenfell St, Adelaide",
		location:"Grenfell St, Adelaide",
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