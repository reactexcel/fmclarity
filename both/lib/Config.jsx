//I kind of feel like a lot of this would be better in the database

Config = {};

// a bit more configuration here wouldn't go astray
//eg:
/*

	fm:{
		manager:[{
			name:"Dashboard",
			route:"dashboard"
		},
		{
			name:"Portfolio",
			route:"portfolio"
		}]
	}

*/

var navFMSupport = [{
	path:"dashboard",		
	label:"Dashboard",
	icon:"fa fa-newspaper-o"
},{
	path:"portfolio",		
	label:"Portfolio",
	icon:"fa fa-building"
},{
	path:"suppliers",		
	label:"Suppliers",
	icon:"fa fa-group"
},{
	path:"requests",		
	label:"Requests",
	icon:"fa fa-wrench"
},{
	path:"reports",		
	label:"Reports",
	icon:"fa fa-bar-chart"
}];

var navFM = [{
	path:"dashboard",		
	label:"Dashboard",
	icon:"fa fa-newspaper-o"
},{
	path:"portfolio",		
	label:"Portfolio",
	icon:"fa fa-building"
},{
	path:"suppliers",		
	label:"Suppliers",
	icon:"fa fa-group"
},{
	path:"requests",		
	label:"Requests",
	icon:"fa fa-wrench"
}];

if(false) {
	navFM.push({
		path:"maintenence",
		label:"Maintenence",
		icon:"fa fa-calendar"
	});
	navFM.push({
		path:"compliance",
		label:"Compliance",
		icon:"fa fa-check-square"
	});
	navFM.push({
		path:"Sustainability",
		label:"Sustainability",
		icon:"fa fa-leaf"
	});
	navFM.push({
		path:"contracts",
		label:"Contracts",
		icon:"fa fa-file-text-o"
	});
	navFM.push({
		path:"reports",
		label:"Reports",
		icon:"fa fa-bar-chart"
	});
}

var navFMStaff = [{
	path:"requests",		
	label:"Requests",
	icon:"fa fa-wrench"
},{
	path:"portfolio",		
	label:"Portfolio",
	icon:"fa fa-building"
}];

var navSupplier = [{
	path:"requests",		
	label:"Jobs",
	icon:"fa fa-wrench"
},{
	path:"portfolio",		
	label:"Sites",
	icon:"fa fa-building"
},{
	path:"suppliers",		
	label:"Clients",
	icon:"fa fa-group"
}];

var navTenant = [{
	path:"requests",		
	label:"Requests",
	icon:"fa fa-wrench"
}];

Config.modules = {
	fm:{
		manager:navFM,
		'fmc support':navFM,
		staff:navFMStaff,
		tenant:navTenant,
		contact:[],
	},
	contractor:{
		'fmc support':navFM,
		manager:navSupplier,
		staff:navSupplier
	}
}

Config.validEmails = {
  'gmail.com':['mrleokeith','mr.richo'],
  'fmclarity.com':'*'
};

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
	name:"Carparks",
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
	name:"R&M",
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
	name:"BAS",
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
	service.active = false;
	service.hasChildren = true;
	service.children.map(function(subservice) {
		subservice.active = false;
	})
});

Config.defaultAreas =[{
    name:'Ground',
    active:true,
	hasChildren:true,
    data:{},
    children:[{
    	name:'Foyer'
	},{
		name:'Fire Pump Room'
	},{
		name:'Loading Bay',
	},{
		name:'Bin Storage',
	},{
		name:'Switch Room',
	},{
		name:'Cleaner\'s Room',
	}]
},{
    name:'Level 3',
    active:true,
	hasChildren:true,
    data:{},
    children:[{
		name:'Male Bathroom',
		identifiers:[{name:'Front'},{name:'Rear'}]
    },{
		name:'Female Bathroom',
		identifiers:[{name:'Front'},{name:'Rear'}]
    },{
		name:'Accessible Bathroom',
		identifiers:[{name:'Front'},{name:'Rear'}]
    },{
    	name:'Lift lobby'
	},{
		name:'Reception'
	},{
		name:'Lockers',
	},{
		name:'Electrical Riser',
	},{
		name:'Comms Riser',
	},{
		name:'Comms Room',
	},{
		name:'Stairwell',
		identifiers:[{name:'Left'},{name:'Right'}]
	},{
		name:'Fire Cupboard',
		identifiers:[{name:'Left'},{name:'Right'}]
	},

    {
		name:'Classroom',
		identifiers:[{name:'301'}]
	},{
		name:'Office',
		identifiers:[{name:'1'},{name:'2'},{name:'3'},{name:'4'},{name:'5'}]
	},{
		name:'Meeting Room',
		identifiers:[{name:'1'},{name:'2'}]
	},{
		name:'Server Room'
    },{
		name:'Cleaner\'s Room',
	},{
    	name:'Kitchen'
	}]
},{
    name:'Level 4',
    active:true,
	hasChildren:true,
    data:{},
    children:[{
		name:'Male Bathroom',
		identifiers:[{name:'Front'},{name:'Rear'}]
    },{
		name:'Female Bathroom',
		identifiers:[{name:'Front'},{name:'Rear'}]
    },{
		name:'Accessible Bathroom',
		identifiers:[{name:'Front'},{name:'Rear'}]
    },{
    	name:'Lift lobby'
	},{
		name:'Reception'
	},{
		name:'Lockers',
	},{
		name:'Electrical Riser',
	},{
		name:'Comms Riser',
	},{
		name:'Comms Room',
	},{
		name:'Stairwell',
		identifiers:[{name:'Left'},{name:'Right'}]
	},{
		name:'Fire Cupboard',
		identifiers:[{name:'Left'},{name:'Right'}]
	},

	{
		name:'Classroom',
		identifiers:[{name:'405'},{name:'406'},{name:'407'},{name:'408'},{name:'410'},{name:'411'},{name:'412'}]
	},{
		name:'Office',
		identifiers:[{name:'1'},{name:'2'},{name:'3'},{name:'4'},{name:'5'}]
	},{
		name:'Computer Lab',
		identifiers:[{name:'409'},{name:'413'}]
	},{
		name:'Library',
	},{
		name:'Common Area',
	},{
		name:'Academic Desks',
	},{
		name:'Student Services',
	},{
		name:'Lecture Hall',
	},{
    	name:'Kitchen',
		identifiers:[{name:'Staff'},{name:'Student'}]
	}]
},{
    name:'Level 5',
    active:true,
	hasChildren:true,
    data:{},
    children:[{
		name:'Male Bathroom',
		identifiers:[{name:'Front'},{name:'Rear'}]
    },{
		name:'Female Bathroom',
		identifiers:[{name:'Front'},{name:'Rear'}]
    },{
		name:'Accessible Bathroom',
		identifiers:[{name:'Front'},{name:'Rear'}]
    },{
    	name:'Lift lobby'
	},{
		name:'Reception'
	},{
		name:'Lockers',
	},{
		name:'Electrical Riser',
	},{
		name:'Comms Riser',
	},{
		name:'Comms Room',
	},{
		name:'Stairwell',
		identifiers:[{name:'Left'},{name:'Right'}]
	},{
		name:'Fire Cupboard',
		identifiers:[{name:'Left'},{name:'Right'}]
	},

	{
		name:'Classroom',
		identifiers:[{name:'502'},{name:'503'},{name:'504'},{name:'505'},{name:'506'},{name:'507'},{name:'509'},{name:'510'},{name:'511'},{name:'512'},{name:'513'},{name:'515'},{name:'516'}]
	},{
		name:'Office',
		identifiers:[{name:'1'},{name:'2'},{name:'3'}]
	},{
		name:'Computer Lab',
		identifiers:[{name:'409'},{name:'413'}]
	},{
		name:'Lecture Hall',
	},{
		name:'Common Area',
	},{
		name:'Teacher Staffroom',
	},{
    	name:'Kitchen',
		identifiers:[{name:'Staff'},{name:'Student'}]
	}]
},{
    name:'Level 6',
    active:true,
	hasChildren:true,
    data:{},
    children:[{
		name:'Male Bathroom',
		identifiers:[{name:'Front'},{name:'Rear'}]
    },{
		name:'Female Bathroom',
		identifiers:[{name:'Front'},{name:'Rear'}]
    },{
		name:'Accessible Bathroom',
		identifiers:[{name:'Front'},{name:'Rear'}]
    },{
    	name:'Lift lobby'
	},{
		name:'Reception'
	},{
		name:'Lockers',
	},{
		name:'Electrical Riser',
	},{
		name:'Comms Riser',
	},{
		name:'Comms Room',
	},{
		name:'Stairwell',
		identifiers:[{name:'Left'},{name:'Right'}]
	},{
		name:'Fire Cupboard',
		identifiers:[{name:'Left'},{name:'Right'}]
	},

	{
		name:'Classroom',
		identifiers:[{name:'601'},{name:'602'},{name:'603'},{name:'604'},{name:'605'},{name:'606'},{name:'607'},{name:'608'},{name:'KP Training Room'}]
	},{
		name:'Office',
		identifiers:[{name:'1'},{name:'2'},{name:'3'},{name:'4'}]
	},{
		name:'Computer Lab',
		identifiers:[{name:'KP Exam Room'},{name:'600b'}]
	},{
		name:'Board Room',
	},{
		name:'Lecture Hall',
	},{
		name:'Common Area',
	},{
		name:'Shared Services Area',
	},{
    	name:'Kitchen',
		identifiers:[{name:'Staff'},{name:'Student'}]
	},{
		name:'Meeting Room',
		identifiers:[{name:'1'}]
	}]
},{
    name:'Roof',
    active:true,
	hasChildren:true,
    data:{},
    children:[{
		name:'Plant Room 1',
    },{
		name:'Roof',
    }]
},{
    name:'External',
    active:true,
	hasChildren:true,
    data:{},
    children:[{
		name:'Facade',
    },{
		name:'Building Forecourt',
    },{
		name:'Bike Storage',
    },{
		name:'Security Office',
    },{
		name:'MDF',
    },{
		name:'EWIS',
    },{
		name:'Fire Panel',
    }]
},{
    name:'Lifts',
    active:true,
	hasChildren:true,
    data:{},
    children:[{
		name:'Lift 1',
    },{
		name:'Lift 2',
    },{
		name:'Lift 3',
    }]
},{
    name:'Car Parks',
    active:true,
	hasChildren:true,
    data:{},
    children:[{
		name:'Level 1',
    },{
		name:'Level 2',
    }]
}];

function ascendingAlpha(a,b){
	return (a.name<b.name)?-1:1;
}

Config.defaultAreas.sort(ascendingAlpha);
for(var i in Config.defaultAreas) {
	if(Config.defaultAreas[i].children) {
		Config.defaultAreas[i].children.sort(ascendingAlpha)
	}
}

Config.defaultLevels = [{
	name:"Car Parks",
	type:Config.defaultAreas[0],
},{
	name:"External",
	type:Config.defaultAreas[1],
},{
	name:"Ground",
	type:Config.defaultAreas[2],
},{
	name:"Level 3",
	type:Config.defaultAreas[3],
},{
	name:"Level 4",
	type:Config.defaultAreas[4],
},{
	name:"Level 5",
	type:Config.defaultAreas[5],
},{
	name:"Level 6",
	type:Config.defaultAreas[6],
},{
	name:"Lifts",
	type:Config.defaultAreas[7],
},{
	name:"Roof",
	type:Config.defaultAreas[8]
}];