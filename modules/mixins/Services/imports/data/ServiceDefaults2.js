const propTypes = ["Base building","Corporate occupier","Residential strata"]
export default ServiceDefaults2 = [ {
	name: "Access Control",
	propType: propTypes,
	children: [ {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "Cards & Keys",
		propType: [propTypes[0]]
	}, {
		name: "Locks & Keys",
		propType: []
	}, {
		name: "System Maintenance",
		propType: [propTypes[0]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	} ]
}, {
	name: "Air Conditioning (HVAC)",
	propType: propTypes,
	children: [ {
		name: "Air Handling Plant",
		propType: [propTypes[0]]
	}, {
		name: "Air Pressurisation Systems",
		propType: [propTypes[0]]
	}, {
		name: "Base Building",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Boilers",
		propType: [propTypes[0]]
	}, {
		name: "Car Park Carbon Monoxide Sensors",
		propType: [propTypes[0]]
	}, {
		name: "Chillers",
		propType: [propTypes[0]]
	}, {
		name: "Computer Room A/C",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Condensate Pumps",
		propType: [propTypes[0]]
	}, {
		name: "Controls",
		propType: [propTypes[0]]
	}, {
		name: "Cooling Tower Systems",
		propType: [propTypes[0]]
	}, {
		name: "Fans Axial",
		propType: [propTypes[0]]
	}, {
		name: "Fans Centrifugal",
		propType: [propTypes[0]]
	}, {
		name: "Filters",
		propType: [propTypes[0]]
	}, {
		name: "Fire Dampers",
		propType: [propTypes[0]]
	}, {
		name: "Gas Regulators",
		propType: [propTypes[0]]
	}, {
		name: "Kitchen Exhuasts",
		propType: []
	}, {
		name: "Mech Services Switchboard",
		propType: [propTypes[0]]
	}, {
		name: "Outdoor Intakes",
		propType: [propTypes[0]]
	}, {
		name: "Packaged A/C - Split system",
		propType: [propTypes[0]]
	}, {
		name: "Piping Systems",
		propType: [propTypes[0]]
	}, {
		name: "Pressure Vessels",
		propType: []
	}, {
		name: "Pumps",
		propType: [propTypes[0]]
	}, {
		name: "SA/RA Fans",
		propType: [propTypes[0]]
	}, {
		name: "Smoke Spill Fans/Ventilation",
		propType: [propTypes[0]]
	}, {
		name: "Stat Valves",
		propType: [propTypes[0]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Terminal Units",
		propType: [propTypes[0]]
	} ]
}, {
	name: "Building & Fitout Works",
	propType: propTypes,
	children: [ {
		name: "Blinds",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Carpet",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Ceiling Tiles",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	} ]
}, {
	name: "Building Maintenance Unit",
	propType: [propTypes[0]],
	children: []
}, {
	name: "Car park",
	propType: propTypes,
	children: [ {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "Gate Maintenance",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Line Marking",
		propType: [propTypes[0]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	} ]
},{
		name: "Cleaning",
		propType: propTypes,
		children: [ {
			name: "Base Building",
			propType: [propTypes[1]]
		}, {
			name: "Car Park",
			propType: [propTypes[0]]
		}, {
			name: "Carpets",
			propType: [propTypes[0]]
		}, {
			name: "Equipment Maintenance",
			propType: [propTypes[0]]
		}, {
			name: "Exhaust Fans",
			propType: [propTypes[0]]
		}, {
			name: "External Windows",
			propType: [propTypes[0]]
		}, {
			name: "Graffiti Removal",
			propType: [propTypes[0]]
		}, {
			name: "Pressure Washing Entrance",
			propType: [propTypes[0]]
		}, {
			name: "Sanitaries",
			propType: [propTypes[0]]
		}, {
			name: "Supplies",
			propType: [propTypes[0]]
		}, {
			name: "Tenancy",
			propType: [propTypes[0]]
		}, {
			name: "Waste Removal",
			propType: [propTypes[0]]
		}, {
			name: "Windows",
			propType: [propTypes[0]]
		} ]
}, {
	name: "Cooling Tower Systems & Water Treatment",
	propType: [],
	children: [ {
		name: "Risk Management Plan",
		propType: []
	}, {
		name: "Water Testing",
		propType: []
	}, {
		name: "Water Treatment",
		propType: []
	} ]
}, {
	name: "Door Maintenance",
	propType: propTypes,
	children: [ {
		name: "Auto Doors",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "Exit Doors",
		propType: [propTypes[0]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	} ]
}, {
	name: "Electrical Services",
	propType: propTypes,
	children: [ {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "Full Load Test",
		propType: [propTypes[0]]
	}, {
		name: "Generator",
		propType: []
	}, {
		name: "Lighting - Base building",
		propType: propTypes
	}, {
		name: "Lighting - Emergency & Exit",
		propType: []
	}, {
		name: "Lighting - Tenancy",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Lightning Protection",
		propType: []
	}, {
		name: "Residual Current Devices",
		propType: [propTypes[0]]
	}, {
		name: "Switchboard",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	}, {
		name: "Testing & Tagging",
		propType: [propTypes[0]]
	}, {
		name: "Thermographic Scanning",
		propType: [propTypes[0]]
	}, {
		name: "Uninterruptible Power Supply",
		propType: [propTypes[0],propTypes[1]]
	} ]
}, {
	name: "Emergency Management",
	propType: propTypes,
	children: [ {
		name: "Emergency Evacuation Training",
		propType: [propTypes[0]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	}, {
		name: "Warden Training",
		propType: [propTypes[0]]
	} ]
}, {
	name: "Essential Safety Measures",
	propType: propTypes,
	children: [ {
		name: "Inspection",
		propType: [propTypes[0]]
	}, {
		name: "Egress",
		propType: [propTypes[0]]
	} ]
}, {
	name: "External Building Repair",
	propType: propTypes,
	children: [ {
		name: "Façade",
		propType: [propTypes[0]]
	}, {
		name: "Glass",
		propType: [propTypes[0]]
	}, {
		name: "Pavement",
		propType: [propTypes[0]]
	}, {
		name: "Railings",
		propType: [propTypes[0]]
	} ]
}, {
	name: "Fire Protection",
	propType: propTypes,
	children: [ {
		name: "Automatic Sprinkler System",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "Blankets",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Dampers",
		propType: [propTypes[0]]
	}, {
		name: "Detection & Alarm Systems",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Emergency Planning",
		propType: []
	}, {
		name: "Emergency Warning & Intercommunication Systems",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Extinguishers",
		propType: propTypes
	}, {
		name: "Fire Doors",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Fire Hose Reels",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Fire Indicator Panel",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Full Function Fire Test",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Gasseous Systems",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Hydrant Valves",
		propType: []
	}, {
		name: "Hydrants",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Lay Flat Hose",
		propType: []
	}, {
		name: "Monitoring",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Passive Fire & Smoke Systems",
		propType: []
	}, {
		name: "Pumpsets",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Smoke Detectors",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Special Hazard Systems",
		propType: []
	}, {
		name: "Sprinklers",
		propType: []
	}, {
		name: "Tenancy",
		propType: [propTypes[0],propTypes[2]]
	}, {
		name: "Water Storage Tanks",
		propType: []
	} ]
}, {
	name: "Furniture",
	propType: propTypes,
	children: [ {
		name: "Chairs",
		propType: [propTypes[1]]
	}, {
		name: "Lounges",
		propType: [propTypes[1]]
	}, {
		name: "Tables",
		propType: [propTypes[1]]
	}, {
		name: "Workstations",
		propType: [propTypes[1]]
	} ]
}, {
	name: "Furniture Removal",
	propType: [propTypes[0],propTypes[1]],
	children: []
}, {
	name: "General Repairs & Maintenance",
	propType: propTypes,
	children: [ {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "General",
		propType: [propTypes[0]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	} ]
}, {
	name: "Glass Repair",
	propType: propTypes,
	children: [ {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "General",
		propType: [propTypes[0]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	} ]
}, {
	name: "High Access",
	propType: propTypes,
	children: [ {
		name: "Anchor Points",
		propType: []
	}, {
		name: "Façade",
		propType: []
	}, {
		name: "Height Safety",
		propType: []
	} ]
}, {
	name: "Kitchen Equipment",
	propType: [propTypes[1],propTypes[2]],
	children: []
}, {
	name: "Landscaping",
	propType: propTypes,
	children: []
}, {
	name: "Lifts & Escalators",
	propType: propTypes,
	children: [ {
		name: "Annual Risk review",
		propType: [propTypes[0]]
	}, {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "Escalator Maintenance",
		propType: [propTypes[0]]
	}, {
		name: "Lift Maintenance",
		propType: [propTypes[0]]
	}, {
		name: "Lift Phone",
		propType: [propTypes[0]]
	} ]
}, {
	name: "Office Equipment",
	propType: propTypes,
	children: [ {
		name: "Computers",
		propType: [propTypes[1]]
	}, {
		name: "General",
		propType: [propTypes[1]]
	}, {
		name: "Photocopiers",
		propType: [propTypes[1]]
	}, {
		name: "Printers",
		propType: [propTypes[1]]
	}, {
		name: "Telephones",
		propType: [propTypes[1]]
	} ]
}, {
	name: "Painting",
	propType: propTypes,
	children: [ {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "General",
		propType: [propTypes[0]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	} ]
}, {
	name: "Pest Control",
	propType: propTypes,
	children: []
}, {
	name: "Plants Indoor",
	propType: propTypes,
	children: []
}, {
	name: "Plumbing",
	propType: propTypes,
	children: [ {
		name: "Backflow Prevention Valves",
		propType: []
	}, {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "Hot Water Service",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Potable Water Tank",
		propType: []
	}, {
		name: "Pumps",
		propType: [propTypes[0]]
	}, {
		name: "Repairs & Maintenance",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Roof Repairs",
		propType: [propTypes[0]]
	}, {
		name: "Sewage",
		propType: [propTypes[0]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	}, {
		name: "Thermostatic Mixer Valves",
		propType: []
	} ]
}, {
	name: "Security",
	propType: propTypes,
	children: [ {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "Manpower",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Patrols",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	} ]
}, {
	name: "Signage",
	propType: propTypes,
	children: [ {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "External",
		propType: [propTypes[0]]
	}, {
		name: "Internal",
		propType: [propTypes[0]]
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	} ]
}, {
	name: "Stairs",
	propType: propTypes,
	children: []
}, {
	name: "Sullage Disposal",
	propType: propTypes,
	children: []
}, {
	name: "Utilities",
	propType: propTypes,
	children: [ {
		name: "Electric",
		propType: propTypes
	}, {
		name: "Energy Management",
		propType: []
	}, {
		name: "Gas",
		propType: [propTypes[0]]
	}, {
		name: "Internet",
		propType: propTypes
	}, {
		name: "Meter Reading",
		propType: [propTypes[0]]
	}, {
		name: "Sewer",
		propType: [propTypes[0]]
	}, {
		name: "Telephone",
		propType: propTypes
	}, {
		name: "Waste",
		propType: propTypes
	}, {
		name: "Water",
		propType: propTypes
	} ]
}, {
	name: "Water Cooler",
	propType: propTypes,
	children: [ {
		name: "Billi Units",
		propType: [propTypes[1]]
	}, {
		name: "Bottled Water",
		propType: [propTypes[1]]
	} ]
}, {
	name: "Workplace Health & Safety",
	propType: propTypes,
	children: [ {
		name: "Asbestos & Hazardous Materials",
		propType: []
	}, {
		name: "Base Building",
		propType: [propTypes[1]]
	}, {
		name: "Confined Spaces",
		propType: []
	}, {
		name: "Contractor Management",
		propType: []
	}, {
		name: "Critical Environment",
		propType: []
	}, {
		name: "Dangerous Goods & Hazardous Substances",
		propType: []
	}, {
		name: "General",
		propType: [propTypes[0],propTypes[1]]
	}, {
		name: "Grease Trap Disposal",
		propType: []
	}, {
		name: "Hazardous Waste",
		propType: []
	}, {
		name: "House Rules",
		propType: []
	}, {
		name: "Indoor Air Quality",
		propType: []
	}, {
		name: "Property Risk",
		propType: []
	}, {
		name: "Radio Frequency Radiation",
		propType: []
	}, {
		name: "Slip Test",
		propType: []
	}, {
		name: "Tenancy",
		propType: [propTypes[0]]
	}, {
		name: "Trade Waste",
		propType: []
	} ]
}, {
	name: "Underground Petroleum Storage Systems",
	propType: [],
	children: [ {
		name: "Energy Management",
		propType: []
	}, {
		name: "Groundwater Monitoring",
		propType: []
	}, {
		name: "Leak Detection",
		propType: []
	} ]
} ];
