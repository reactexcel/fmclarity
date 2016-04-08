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
	service.active = true;
	service.hasChildren = true;
	service.children.map(function(subservice) {
		subservice.active = true;
	})
});

Config.defaultAreas =[{
    name:'Level Type 3',
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
    	name:'Kitchen'
	}]
},{
    name:'Standard Level Type 4',
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
    	name:'Kitchen'
	}]
},{
    name:'Standard Level Type 5',
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
		name:'Computer Lab',
	},{
		name:'Common Area',
	},{
		name:'Teacher Staffroom',
	}]
},{
    name:'Standard Level Type 6',
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
	}]
},{
	name:'Unique area',
    hidden:true
}];

Config.defaultLevels = [{
	name:"Level 3",
	type:Config.defaultAreas[0],
},{
	name:"Level 4",
	type:Config.defaultAreas[1],
},{
	name:"Level 5",
	type:Config.defaultAreas[2],
},{
	name:"Level 6",
	type:Config.defaultAreas[3],
}];
