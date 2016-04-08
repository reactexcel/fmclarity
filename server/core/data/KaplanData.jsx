KaplanServices = [{
	active:true,
	name:"Access Control"
},{
	name:"Air Conditioning",
	active:true,
	children:[{
		active:true,
		name:"Air Handling Plant"
	},{
		active:true,
		name:"Computer Room A/C"
	},{
		active:true,
		name:"Packaged A/C - Split System"
	}]
},{
	active:true,
	name:"Cleaning",
	children:[{
		active:true,
		name:"Carpets"
	},{
		active:true,
		name:"Sanitaries"
	},{
		active:true,
		name:"Windows"
	},{
		active:true,
		name:"External Windows"
	},{
		active:true,
		name:"Pressure Washing Entrance"
	}]
},{
	active:true,
	name:"Door Maintenence"
},{
	active:true,
	name:"Electrical",
	children:[{
		active:true,
		name:"Switchboard"		
	},{
		active:true,
		name:"RCDs"
	},{
		active:true,
		name:"Thermographic Scanning"
	},{
		active:true,
		name:"Testing & Tagging - Kaplan Internal"
	},{
		active:true,
		name:"Testing & Tagging - Building"
	},{
		active:true,
		name:"Full load test"
	}]
},{
	active:true,
	name:"Emergency Management Planning",
	children:[{
		active:true,
		name:"Warden Training"
	},{
		active:true,
		name:"Emergency Evacuation Training"
	}]
},{
	active:true,
	name:"Essential Safety Measures",
	children:[{
		active:true,
		name:"Inspection"
	},{
		active:true,
		name:"Paths of Travel to Exits"
	}]
},{
	active:true,
	name:"Fire Protection",
	children:[{
		active:true,
		name:"Fire Extinguishers"
	},{
		active:true,
		name:"Fire Hose Reels"
	},{
		active:true,
		name:"Fire Hydrant System"
	},{
		active:true,
		name:"Automatic Sprinkler System"
	},{
		active:true,
		name:"Pumpsets"
	},{
		active:true,
		name:"Fire Detection & Alarm System"
	},{
		active:true,
		name:"Ewis"
	},{
		active:true,
		name:"Fire Doors"
	},{
		active:true,
		name:"Passive Fire System"
	},{
		active:true,
		name:"Full Function Fire System"
	}]
},{
	active:true,
	name:"General Repairs"
},{
	active:true,
	name:"High Access"
},{
	active:true,
	name:"Kitchen Equipment"
},{
	active:true,
	name:"Lifts"
},{
	active:true,
	name:"OHS"
},{
	active:true,
	name:"Pest Control"
},{
	active:true,
	name:"Plumbing"
},{
	active:true,
	name:"Security"
},{
	active:true,
	name:"Rubbish Removal"
},{
	active:true,
	name:"Water Coolers",
	children:[{
		active:true,
		name:"Billi Units"
	},{
		active:true,
		name:"Bottled Water"
	}]
},{
	active:true,
	name:"Plants"
}]

KaplanFacilities = [
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
		services:KaplanServices
	},
	/*
	{
		name:"Hay St, Perth",
		location:"Hay St, Perth",
		address:{
			streetNumber:"1525",
			streetName:"Hay",
			streetType:"Street",
			city:"Perth",
			state:"WA",
			country:"Australia",
			buildingName:"Hay St, Perth",
		}
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
		}
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
		}
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
		}
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
		}
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
		}
	},
	{
		name:"Osbourne Park",
		location:"Hasler Rd, Osbourne Park",
		address:{
			streetNumber:"1/76",
			streetName:"Hasler",
			streetType:"Road",
			city:"Osbourne Park",
			state:"WA",
			country:"Australia",
			buildingName:"Franklin Scholar",
		}
	},
	{
		name:"Cantebury",
		location:"Shierlaw Ave, Cantebury",
		address:{
			streetNumber:"21",
			streetName:"Shierlaw",
			streetType:"Avenue",
			city:"Canterbury",
			state:"VIC",
			country:"Australia",
			buildingName:"Franklin Scholar",
		}
	},
	{
		name:"Launceston",
		location:"Cameron St, Launceston",
		address:{
			streetNumber:"65",
			streetName:"Cameron",
			streetType:"Street",
			city:"Launceston",
			state:"TAS",
			country:"Australia",
			buildingName:"Franklin Scholar",
		}
	},
	{
		name:"Hobart",
		location:"Warwick St, Hobart",
		address:{
			streetNumber:"12",
			streetName:"Warwick",
			streetType:"Street",
			city:"Hobart",
			state:"TAS",
			country:"Australia",
			buildingName:"Franklin Scholar",
		}
	},
	{
		name:"Peel St, Adelaide",
		location:"Peel St, Adelaide",
		address:{
			streetNumber:"22",
			streetName:"Peel",
			streetType:"Street",
			city:"Adelaide",
			state:"SA",
			country:"Australia",
			buildingName:"Professional & International English",
		}
	},
	{
		name:"Spring Hill",
		location:"St Pauls Terrace, Spring Hill",
		address:{
			streetNumber:"252",
			streetName:"Pauls",
			streetType:"Terrace",
			city:"Spring Hill",
			state:"QLD",
			country:"Australia",
			buildingName:"Professional & International English",
		}
	},
	{
		name:"Cairns",
		location:"McLeod St, Cairns",
		address:{
			streetNumber:"130",
			streetName:"McLeod",
			streetType:"Street",
			city:"Cairns",
			state:"QLD",
			country:"Australia",
			buildingName:"Professional & International English",
		}
	},
	{
		name:"Grenfell St, Adelaide",
		location:"Grenfell St, Adelaide",
		address:{
			streetNumber:"132",
			streetName:"Grenfell",
			streetType:"Street",
			city:"Adelaide",
			state:"SA",
			country:"Australia",
			buildingName:"Bradford College",
		}
	}
	*/
];