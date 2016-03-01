Config = {};

Config.modules = {
	fm:{
		manager:['dashboard','portfolio','suppliers','requests'],
		support:['dashboard','portfolio','suppliers','requests'],
		staff:['dashboard','portfolio','suppliers','requests'],
		tenant:['requests'],
		contact:[],
	},
	contractor:{
		manager:['portfolio','requests'],
		staff:['portfolio','requests'],
	}
}

Config.validEmails = {
  'gmail.com':['mrleokeith','mr.richo'],
  'fmclarity.com':'*'
};

Config.areaNames = [
	"",
	"Office floor",
	"Male bathroom",
	"Female bathroom",
	"Disabled bathroom",
	"Lift lobby",
	"Kitchenette",
	"Photocopy room",
	"First aid room",
	"Entrance door",
	"Lockers",
	"Electrical riser",
	"Comms riser",
	"Comms room",
	"Stairwell",
	"Fire cupboard",
	"Meeting room 1",
	"Meeting room 2",
	"Meeting room 3",
	"Meeting room 4",
	"Meeting room 5",
	"Meeting room 6",
	"Meeting room 7",
	"Meeting room 8",
	"Seminar room",
	"Board room",
	"Conference room",

	
	"Lift 1",
	"Lift 2",
	"Lift 3",
	"Lift 4",
	"Lift 5",
	"Lift 6",
	"Lift 7",
	"Lift 8",
	"Foyer",
	"Fire pump room",
	"Generator room",
	"Concierge",
	"Reception",
	"Café",
	"Loading dock",
	"Bin storage",
	"Carpark level 0",
	"Carpark level 1",
	"Carpark level 2",
	"Carpark level 3",
	"Carpark level 4",
	"Switch room",
	"Cleaner’s room",
	"Plant room 1",
	"Plant room 2",
	"Lift motor room",
	"Roof",
	"Upper façade",
	"Lower façade",
	"Building forecourt",
	"Bike storage",
	"Security office",
	"MDF",
	"EWIS",
	"Fire panel",
	"Male changerooms",
	"Female changerooms"
];

Config.cycleNames = [
	"",
	"Daily",
	"Weekly",
	"Fortnightly",
	"Monthly",
	"Quarterly",
	"Half-yearly",
	"Yearly",
];

Config.areas = [];
Config.areaNames.map(function(areaName){
	Config.areas.push({
		name:areaName,
		cycle:"",
		contractor:{}
	});
});

Config.services = [{
	name:"Air Conditioning",
	children:[{
		name:"Contract maintenance",
	},{
		name:"R&M",
	},{
		name:"Boilers",
	},{
		name:"Filters",
	},{
		name:"Controls",
	},{
		name:"Chillers",
	},{
		name:"Water Treatment",
	},{
		name:"Materials",
	},{
		name:"Gas",
	}]
},{
	name:"Cleaning",
	children:[{
		name:"Contract",
	},{
		name:"R&M",
	},{
		name:"Carpet shampoo",
	},{
		name:"Carpark cleaning",
	},{
		name:"Common area",
	},{
		name:"Equipment maintenance",
	},{
		name:"Materials",
	},{
		name:"Rubbish removal - landfill",
	},{
		name:"Rubbish removal - recycling",
	},{
		name:"Sanitaries",
	},{
		name:"Exhaust fans",
	},{
		name:"Windows",
	},{
		name:"Other",
	}]
},{
	name:"Carpark maintenance",
	children:[{
		name:"Contract",
	},{
		name:"R&M",
	},{
		name:"Sweeping",
	},{
		name:"Line marking",
	},{
		name:"Other",
	},{
		name:"Security",
	},{
		name:"Signs",
	}]
},{
	name:"Fire protection",
	children:[{
		name:"Call out",
	},{
		name:"Contract",
	},{
		name:"Emergency exit lights",
	},{
		name:"Emergency equip and training",
	},{
		name:"EWIS",
	},{
		name:"Extinguishers",
	},{
		name:"Fire brigade fees",
	},{
		name:"Gasseous suppression systems",
	},{
		name:"Others",
	},{
		name:"R&M",
	},{
		name:"Sprinkler system",
	},{
		name:"Thermal system",
	},{
		name:"Telephone line rent",
	}]
},{
	name:"Generator",
	children:[{
		name:"Contract",
	},{
		name:"R&M",
	},{
		name:"Fuel",
	}]
},{
	name:"Pest control",
	children:[{
		name:"Contract",
	},{
		name:"Other",
	}]
},{
	name:"Plumbing",
	children:[{
		name:"Contract",
	},{
		name:"Other",
	},{
		name:"R&M",
	},{
		name:"Sullage",
	}]
},{
	name:"Repairs & Maintenance",
	children:[{
		name:"Auto doors",
	},{
		name:"BMU",
	},{
		name:"Boom gates",
	},{
		name:"Carpet",
	},{
		name:"Directory board",
	},{
		name:"Electrical",
	},{
		name:"Emergency systems",
	},{
		name:"Environmental",
	},{
		name:"Equipment hire",
	},{
		name:"Foodcourt",
	},{
		name:"General",
	},{
		name:"General Xmas",
	},{
		name:"Glass repair",
	},{
		name:"Grafitti removal",
	},{
		name:"Hazmat",
	},{
		name:"Lamps and tubes",
	},{
		name:"Locks, keys and cards",
	},{
		name:"Other",
	},{
		name:"Painting",
	},{
		name:"Partitions",
	},{
		name:"Roller shutters",
	},{
		name:"Safety",
	},{
		name:"Signs",
	},{
		name:"Structural",
	},{
		name:"Surfaces",
	},{
		name:"Tenancy restoration",
	}]
},{
	name:"Security",
	children:[{
		name:"Contract staff",
	},{
		name:"Other",
	},{
		name:"R&M",
	},{
		name:"Access control",
	},{
		name:"CCTV",
	},{
		name:"Patrols",
	}]
},{
	name:"Water treatment",
	children:[{
		name:"Contract",
	},{
		name:"Other",
	},{
		name:"R&M",
	}]
},{
	name:"Building Automation System",
	children:[{
		name:"Contract",
	},{
		name:"Other",
	},{
		name:"R&M",
	},{
		name:"Engineering",
	},{
		name:"Sustainability",
	}]
},{
	name:"Signs",
	children:[{
		name:"Contract",
	},{
		name:"Other",
	},{
		name:"R&M",
	},{
		name:"Lease",
	},{
		name:"Electricity",
	},{
		name:"Cleaning",
	}]
},{
	name:"Landscaping",
	children:[{
		name:"Contract",
	},{
		name:"External hire",
	},{
		name:"R&M",
	},{
		name:"Internal hire",
	},{
		name:"Other",
	},{
		name:"Materials",
	}]
},{
	name:"Miscellaneous",
	children:[{
		name:"Consultants",
	},{
		name:"Entertainment",
	},{
		name:"Photocopier",
	},{
		name:"Postage & deliveries",
	},{
		name:"Printing & stationery",
	},{
		name:"Subscriptions",
	},{
		name:"Sundry",
	},{
		name:"Survey & valuation",
	},{
		name:"Travel",
	}]
},{
	name:"Sustainability",
	children:[{
		name:"Contract",
	},{
		name:"Other",
	},{
		name:"R&M",
	},{
		name:"Engineering",
	}]
},{
	name:"Lifts",
	children:[{
		name:"Contract",
	},{
		name:"Materials",
	},{
		name:"Electricity",
	},{
		name:"R&M",
	},{
		name:"Consultant",
	},{
		name:"Lift phone",
	},{
		name:"Other",
	}]
}];

Config.services.map(function(service){
	service.contractor = {};
	service.available = false;
	service.children.map(function(subservice) {
		subservice.available = true;
	})
});

Config.defaultAreas =[ {
    name:'Standard level',
    number:1,
    areas:[{
		name:'Conference room',
		location:'North',
		number:1
	},{
		name:'Male bathroom',
		location:'North',
		number:1
	},{
		name:'Female bathroom',
        location:'South',
        number:1
    },{
    	name:'Staff room',
		number:1
    },{
    	name:'Work room',
		number:5
	}]
},{
	name:'Unique areas',
	number:1,
	areas:[{
    	name:'Board room',
        number:1
    },{
    	name:'Reception',
        number:1
    },{
    	name:'Basement',
        number:1
    }]
}];