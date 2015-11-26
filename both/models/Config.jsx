Config = FM.createCollection('Config',{
	services:{
		type:[Object]
	},
	areas:{
		type:[Object]
	}
});

if(Meteor.isServer) {
Config.remove({});
Config.insert({
	areas:[{
		name:"Male bathrooms",
		cycle:"Half-yearly",
		_contractor:{},
	},{
		name:"Female bathrooms",
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
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Chillers",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Boilers",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Filters",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Controls",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Fire Dampers",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Smoke Spill Fans / Ventilation",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Other Mechanical Plant",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Generator",
			cycle:"Half-yearly",
			_contractor:{},
		}]
	},
	{
		name:"Fire Protection",
		_contractor:{},
		subservices:[{
			name:"Extinguisher Install",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Extinguisher Re-Fill",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Extinguisher Testing",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Automatic Sprinkler System",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Pumpsets",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Fire Detection & Alarm System",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"EWIS",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Fire Doors",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Paths of Travel to Exits",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Exit Doors",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Passive Fire Systems",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Static Water Storage",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Smoke / Heat Vents",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Gaseous Suppression System",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Full Function Fire Test",
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
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Security lights",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Exit lights",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Light globes",
			cycle:"Half-yearly",
			_contractor:{},
		}]
	},
	{
		name:"Lifts",
		_contractor:{},
		subservices:[{
			name:"Not leveling",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Repair fittings",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Telephone inside car",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Elevator music",
			cycle:"Half-yearly",
			_contractor:{},
		},{
			name:"Elevator stuck",
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
]});
}