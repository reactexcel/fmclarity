Config = {
	areaNames:[
		"",
		"Male bathroom",
		"Female bathroom",
		"Bathroom",
		"Lift lobby",
		"Kitchen",
		"Work room",
		"Reception",
		"Basement",
		"Mezzanine",
		"Lift 1",
		"Lift 2",
		"Lift 3",
		"Lift 4",
		"Seminar room",
		"Board room",
		"Conference room"
	],
	cycleNames:[
		'Daily',
		'Weekly',
		'Fortnightly',
		'Monthly',
		'Quarterly',
		'Half-yearly',
		'Yearly',
	],
	areas:[{
		name:"Male bathroom",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Female bathroom",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Lift lobby",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Kitchen",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Workroom",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Mezzanine",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Lift 1",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Lift 2",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Lift 3",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Lift 4",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Seminar room",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Board room",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Conference room",
		cycle:"Half-yearly",
		_contractor:{},
	}],
	services:[{
		name:"Mechanical",
		_contractor:{},
		subservices:[{
			name:"Air Handling Plant",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Chillers",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Boilers",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Filters",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Controls",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Fire Dampers",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Smoke Spill Fans / Ventilation",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Other Mechanical Plant",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Generator",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		}]
	},
	{
		name:"Fire Protection",
		_contractor:{},
		subservices:[{
			name:"Extinguisher Install",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Extinguisher Re-Fill",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Extinguisher Testing",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Automatic Sprinkler System",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Pumpsets",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Fire Detection & Alarm System",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"EWIS",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Fire Doors",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Paths of Travel to Exits",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Exit Doors",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Passive Fire Systems",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Static Water Storage",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Smoke / Heat Vents",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Gaseous Suppression System",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Full Function Fire Test",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		}]
	},
	{
		name:"Electrical",
		_contractor:{},
	},{
		name:"Water Treatment",
		_contractor:{},
	},{
		name:"UPS",
		_contractor:{},
	},{
		name:"Generator",
		_contractor:{},
	},{
		name:"E&E Lighting",
		_contractor:{},
		subservices:[{
			name:"Emergency lights",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Security lights",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Exit lights",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Light globes",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		}]
	},
	{
		name:"Lifts",
		_contractor:{},
		subservices:[{
			name:"Not leveling",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Repair fittings",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Telephone inside car",
			available:false,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Elevator music",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Elevator stuck",
			available:true,
			cycle:"Half-yearly",
			_contractor:{},
		}]
	},{
		name:"Egress",
		_contractor:{},
	},{
		name:"ESM",
		_contractor:{},
	},{
		name:"Waste removal",
		_contractor:{},
	}
]}