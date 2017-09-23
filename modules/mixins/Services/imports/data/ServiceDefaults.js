export default ServiceDefaults = [ {
	name: "Air Conditioning",
	children: [ {
		name: "Contract maintenance",
	}, {
		name: "R&M",
	}, {
		name: "Boilers",
	}, {
		name: "Filters",
	}, {
		name: "Controls",
	}, {
		name: "Chillers",
	}, {
		name: "Water Treatment",
	}, {
		name: "Materials",
	}, {
		name: "Gas",
	} ]
}, {
	name: "Cleaning",
	children: [ {
		name: "Contract",
	}, {
		name: "R&M",
	}, {
		name: "Carpet shampoo",
	}, {
		name: "Carpark cleaning",
	}, {
		name: "Common area",
	}, {
		name: "Equipment maintenance",
	}, {
		name: "Materials",
	}, {
		name: "Rubbish removal - landfill",
	}, {
		name: "Rubbish removal - recycling",
	}, {
		name: "Sanitaries",
	}, {
		name: "Exhaust fans",
	}, {
		name: "Windows",
	}, {
		name: "Other",
	} ]
}, {
	name: "Carparks",
	children: [ {
		name: "Contract",
	}, {
		name: "R&M",
	}, {
		name: "Sweeping",
	}, {
		name: "Line marking",
	}, {
		name: "Other",
	}, {
		name: "Security",
	}, {
		name: "Signs",
	} ]
}, {
	name: "Fire protection",
	children: [ {
		name: "Call out",
	}, {
		name: "Contract",
	}, {
		name: "Emergency exit lights",
	}, {
		name: "Emergency equip and training",
	}, {
		name: "EWIS",
	}, {
		name: "Extinguishers",
	}, {
		name: "Fire brigade fees",
	}, {
		name: "Gasseous suppression systems",
	}, {
		name: "Others",
	}, {
		name: "R&M",
	}, {
		name: "Sprinkler system",
	}, {
		name: "Thermal system",
	}, {
		name: "Telephone line rent",
	} ]
}, {
	name: "Generator",
	children: [ {
		name: "Contract",
	}, {
		name: "R&M",
	}, {
		name: "Fuel",
	} ]
}, {
	name: "Pest control",
	children: [ {
		name: "Contract",
	}, {
		name: "Other",
	} ]
}, {
	name: "Plumbing",
	children: [ {
		name: "Contract",
	}, {
		name: "Other",
	}, {
		name: "R&M",
	}, {
		name: "Sullage",
	} ]
}, {
	name: "R&M",
	children: [ {
		name: "Auto doors",
	}, {
		name: "BMU",
	}, {
		name: "Boom gates",
	}, {
		name: "Carpet",
	}, {
		name: "Directory board",
	}, {
		name: "Electrical",
	}, {
		name: "Emergency systems",
	}, {
		name: "Environmental",
	}, {
		name: "Equipment hire",
	}, {
		name: "Foodcourt",
	}, {
		name: "General",
	}, {
		name: "General Xmas",
	}, {
		name: "Glass repair",
	}, {
		name: "Grafitti removal",
	}, {
		name: "Hazmat",
	}, {
		name: "Lamps and tubes",
	}, {
		name: "Locks, keys and cards",
	}, {
		name: "Other",
	}, {
		name: "Painting",
	}, {
		name: "Partitions",
	}, {
		name: "Roller shutters",
	}, {
		name: "Safety",
	}, {
		name: "Signs",
	}, {
		name: "Structural",
	}, {
		name: "Surfaces",
	}, {
		name: "Tenancy restoration",
	} ]
}, {
	name: "Security",
	children: [ {
		name: "Contract staff",
	}, {
		name: "Other",
	}, {
		name: "R&M",
	}, {
		name: "Access control",
	}, {
		name: "CCTV",
	}, {
		name: "Patrols",
	} ]
}, {
	name: "Water treatment",
	children: [ {
		name: "Contract",
	}, {
		name: "Other",
	}, {
		name: "R&M",
	} ]
}, {
	name: "BAS",
	children: [ {
		name: "Contract",
	}, {
		name: "Other",
	}, {
		name: "R&M",
	}, {
		name: "Engineering",
	}, {
		name: "Sustainability",
	} ]
}, {
	name: "Signs",
	children: [ {
		name: "Contract",
	}, {
		name: "Other",
	}, {
		name: "R&M",
	}, {
		name: "Lease",
	}, {
		name: "Electricity",
	}, {
		name: "Cleaning",
	} ]
}, {
	name: "Landscaping",
	children: [ {
		name: "Contract",
	}, {
		name: "External hire",
	}, {
		name: "R&M",
	}, {
		name: "Internal hire",
	}, {
		name: "Other",
	}, {
		name: "Materials",
	} ]
}, {
	name: "Miscellaneous",
	children: [ {
		name: "Consultants",
	}, {
		name: "Entertainment",
	}, {
		name: "Photocopier",
	}, {
		name: "Postage & deliveries",
	}, {
		name: "Printing & stationery",
	}, {
		name: "Subscriptions",
	}, {
		name: "Sundry",
	}, {
		name: "Survey & valuation",
	}, {
		name: "Travel",
	} ]
}, {
	name: "Sustainability",
	children: [ {
		name: "Contract",
	}, {
		name: "Other",
	}, {
		name: "R&M",
	}, {
		name: "Engineering",
	} ]
}, {
	name: "Lifts",
	children: [ {
		name: "Contract",
	}, {
		name: "Materials",
	}, {
		name: "Electricity",
	}, {
		name: "R&M",
	}, {
		name: "Consultant",
	}, {
		name: "Lift phone",
	}, {
		name: "Other",
	} ]
},
// New Services added on 13th september 2017
/*{
	name: "Access Control",
	propType: ["Base building","Corporate occupier","Residential strata"],
	children: [ {
		name: "Base Building",
		propType: ["Corporate occupier"]
	}, {
		name: "Cards & Keys",
		propType: ["Base building"]
	}, {
		name: "Locks & Keys",
		propType: []
	}, {
		name: "System Maintenance",
		propType: ["Base building"]
	}, {
		name: "Tenancy",
		propType: ["Base building"]
	} ]
}, {
	name: "Air Conditioning (HVAC)",
	propType: ["Base building","Corporate occupier","Residential strata"],
	children: [ {
		name: "Air Handling Plant",
		propType: ["Base building"]
	}, {
		name: "Air Pressurisation Systems",
		propType: ["Base building"]
	}, {
		name: "Base Building",
		propType: ["Base building","Corporate occupier"]
	}, {
		name: "Boilers",
		propType: ["Base building"]
	}, {
		name: "Car Park Carbon Monoxide Sensors",
		propType: ["Base building"]
	}, {
		name: "Chillers",
		propType: ["Base building"]
	}, {
		name: "Computer Room A/C",
		propType: ["Base building","Corporate occupier"]
	}, {
		name: "Condensate Pumps",
		propType: ["Base building"]
	}, {
		name: "Controls",
		propType: ["Base building"]
	}, {
		name: "Cooling Tower Systems",
		propType: ["Base building"]
	}, {
		name: "Fans Axial",
		propType: ["Base building"]
	}, {
		name: "Fans Centrifugal",
		propType: ["Base building"]
	}, {
		name: "Filters",
		propType: ["Base building"]
	}, {
		name: "Fire Dampers",
		propType: ["Base building"]
	}, {
		name: "Gas Regulators",
		propType: ["Base building"]
	}, {
		name: "Kitchen Exhuasts",
		propType: []
	}, {
		name: "Mech Services Switchboard",
		propType: ["Base building"]
	}, {
		name: "Outdoor Intakes",
		propType: ["Base building"]
	}, {
		name: "Packaged A/C - Split system",
		propType: ["Base building"]
	}, {
		name: "Piping Systems",
		propType: ["Base building"]
	}, {
		name: "Pressure Vessels",
		propType: []
	}, {
		name: "Pumps",
		propType: ["Base building"]
	}, {
		name: "SA/RA Fans",
		propType: ["Base building"]
	}, {
		name: "Smoke Spill Fans/Ventilation",
		propType: ["Base building"]
	}, {
		name: "Stat Valves",
		propType: ["Base building"]
	}, {
		name: "Terminal Units",
		propType: ["Base building"]
	} ]
}, {
	name: "Building & Fitout Works",
	propType: ["Base building","Corporate occupier","Residential strata"],
	children: [ {
		name: "Blinds",
		propType: ["Base building","Corporate occupier"]
	}, {
		name: "Carpet",
		propType: ["Base building","Corporate occupier"]
	}, {
		name: "Ceiling Tiles",
		propType: ["Base building","Corporate occupier"]
	}, {
		name: "Tenancy",
		propType: ["Base building"]
	} ]
}, {
	name: "Building Maintenance Unit",
	propType: ["Base building"]
}, {
	name: "Car park",
	propType: ["Base building","Corporate occupier","Residential strata"],
	children: [ {
		name: "Base Building",
		propType: ["Corporate occupier"]
	}, {
		name: "Gate Maintenance",
		propType: ["Base building","Residential strata"]
	}, {
		name: "Line Marking",
		propType: ["Base building"]
	}, {
		name: "Tenancy",
		propType: ["Base building"]
	} ]
}*/ ];
