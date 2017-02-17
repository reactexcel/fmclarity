export default DefaultComplianceRule = {
	"Fire Protection": [ {
		"type": "Document is current",
		"docType": "Contract",
		"docName": "FPS Contract"
	}, {
		"type": "Document exists",
		"docType": "Service Report",
		"docName": "FPS Service Report"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Sprinklers Annual"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Sprinklers 5 yearly"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Sprinklers 10 yearly"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Sprinklers 25 yearly"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Sprinklers 30 yearly"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Pumpset annual test"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Pumpset 5 yearly servicet"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Pumpset 10 yearly service"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Hydrants yearly"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Hydrants 5 yearly"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Hydrant valves Annual"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Water storage tanks Annual"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Water storage tanks Ten yearly"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Fire detection and alarm systems Annual"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Fire detection and alarm systems Five yearly"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Special hazard systems - smoke alarms Annual"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Special hazard systems - smoke alarms Ten yearly"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Lay flat hose Annual"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Hose reels Annual"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Extinguishers Annual"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Extinguishers Five yearly"
	}, {
		"type": "Document exists",
		docType: "",
		"docName": "Extinguishers Annual condition report"
	}, {
		"type": "Document is current",
		docType: "Contract",
		"docName": "Fire Doors Contract"
	}, {
		"type": "Document is current",
		docType: "Service Report",
		"docName": "Fire Doors Service reports"
	}, {
		"type": "Document is current",
		"docName": "Defects rectified from fire door"
	}, {
		"type": "PPM schedule established",
		"event": "Fire Doors"
	}, {
		"type": "PPM schedule established"
	}, {
		"type": "PPM schedule established",
		"event": "Sprinklers serviced"
	}, {
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "5",
			"unit": "years"
		},
		"event": "Sprinklers serviced"
	}, {
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "1",
			"unit": "years"
		},
		"event": "Pumpset annual test"
	}, {
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "1",
			"unit": "years"
		},
		"event": "Hydrants serviced"
	}, {
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "1",
			"unit": "months"
		},
		"event": "Hydrant valves tested"
	}, {
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "2",
			"unit": "years"
		},
		"event": "Water storage tanks checked"
	}, {
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "1",
			"unit": "years"
		},
		"event": "Fire detection and alarm systems tested"
	} ],

	"Air-conditioning": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Mechanical Services & Air-conditioning Contract"
	   }, {
			"type": "PPM schedule established",
			"event": "Mechanical Services & Air-conditioning"
		}, {
			"type": "Document exists",
			"docType": "Service Report",
			"docName": "Mechanical Services & Air-conditioning Services reports"
		}, {
			"type": "Document exists",
			"docType": "",
			"docName": "Risk assessment (frequency??)"
		}, {
			"type": "Document exists",
			"docType": "",
			"docName": "Plant registraton renewal (Chiller)"
		}, {
			"type": "Document exists",
			"docType": "",
			"docName": "Plant registraton renewal (Pressure vessels)"
		}, {
			"type": "Document exists",
			"docType": "",
			"docName": "Mechanical plant risk assessment"
		}, {
			"type": "Document exists",
			"docType": "",
			"docName": "Compliant full function fire test (FFFT)"
		}, {
			"type": "Document exists",
			"docType": "",
			"docName": "Exhaust ducting clean included on contract"
		}, ],

	"Electrical": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Electrical Services Contract"
	   }, {
			"type": "PPM schedule established",
			"event": "Electrical Services"
		}, {
			"type": "Document exists",
			"docType": "Service Report",
			"docName": "Electrical Services reports"
		}, {
			"type": "PPM schedule established",
			"event": "Electrical Services RCD Test"
		}, {
			"type": "PPM schedule established",
			"event": "Annual switchboard maintenance"
		}, {
			"type": "PPM schedule established",
			"event": "Electrical system thermographic scan"
		}, {
			"type": "PPM schedule established",
			"event": "Lightning protection annual check"
		}, {
			"type": "PPM schedule established",
			"event": "Testing & Tagging"
		}, {
			"type": "PPM schedule established",
			"event": "UPS maintenance"
		} ],
	"Generator": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Generator Contract"
	   }, {
		   "type": "PPM schedule established",
		   "event": "Generator"
	   }, {
		   "type": "Document exists",
		   "docType": "Service Report",
		   "docName": "Generator service reports on file"
	   }, {
		   "type": "Document exists",
		   "docName": "Generator Load Test"
	   } ],

	"Emergency & Exit Lighting": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Emergency & Exit Lighting Contract"
	   }, {
		   "type": "PPM schedule established",
		   "event": "Emergency & Exit Lighting"
	   }, {
		   "type": "Document exists",
		   "docType": "Service Report",
		   "docName": "Emergency & Exit Lighting service reports on file"
	   } ],

	"Water Coolers": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Water Treatment Contract"
	   }, {
		   "type": "Document is current",
		   "docType": "Registration",
		   "docName": "Cooling tower registration"
	   }, {
		   "type": "PPM schedule established",
		   "event": "Water Treatment"
	   }, {
		   "type": "Document exists",
		   "docType": "Service Report",
		   "docName": "Water Treatment service reports on file"
	   }, {
   		   "type": "Document is current",
   		   "docType": "Contract",
   		   "docName": "Water Testing Contract"
   	   }, {
   		   "type": "Document is current",
   		   "docType": "Registration",
   		   "docName": "Water Testing registration"
   	   }, {
   		   "type": "PPM schedule established",
   		   "event": "Water Testing"
   	   }, {
   		   "type": "PPM schedule established",
   		   "event": "Water Testing Risk Management Plan date"
   	   }, {
   		   "type": "PPM schedule established",
   		   "event": "Water Testing RMP Review"
   	   }, {
   		   "type": "PPM schedule established",
   		   "event": "Water Testing RMP Audit"
   	   }, {
   		   "type": "Document exists",
   		   "docName": "Water Testing actions within RMP review addressed"
   	   } ],

	"Plumbing": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Plumbing Contract"
	   }, {
		   "type": "PPM schedule established",
		   "event": "Plumbing"
	   }, {
		   "type": "Document exists",
		   "docType": "Service Report",
		   "docName": "Plumbing service reports on file"
	   }, {
		   "type": "PPM schedule established",
		   "event": "Potable water tank annual clean"
	   }, {
		   "type": "PPM schedule established",
		   "event": "Backflow prevention valve annual maintenance date"
	   }, {
		   "type": "PPM schedule established",
		   "event": "BThermostatic mixer valves annual test"
	   } ],

	"Lifts": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Lifts Contract"
	   }, {
		   "type": "Document exists",
		   "docType": "Procedure",
		   "docName": "PPM schedule has been established"
	   }, {
		   "type": "Document exists",
		   "docType": "Report",
		   "docName": "Service reports on file"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Lift hazard and risk assessment completed (frequency? Ask lift consultants)"
	   }, {
		   "type": "Document exists",
		   "docType": "Registration",
		   "docName": "Lift registration renewal date"
	   }, {
		   "type": "Document exists",
		   "docType": "Audit",
		   "docName": "Lift audit conducted"
	   }, {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Egress Contract"
	   } ],

	"Essential Safety Measures": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Essential Safety Measures Contract"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Annual essential safety measures report (AESMR)"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Maintenance determination/occupancy permit on file"
	   }, {
		   "type": "Document exists",
		   "docType": "Audit",
		   "docName": "Review and audit"
	   }, {
		   "type": "PPM schedule established",
		   "event": "Review and audit"
	   } ],

	"Emergency Management Planning": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Emergency Management Planning Contract"
	   }, {
		   "type": "Document exists",
		   "docType": "Procedure",
		   "docName": "Emergency Response Procedures prepared"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Evacuation diagrams installed"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Emergency evacuation training exercise"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Warden training log"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Chief warden training log"
	   }, {
		   "type": "Document exists",
		   "docType": "Plan",
		   "docName": "Emergency Planning Committee (EPC) meeting"
	   } ],

	"Asbestos & Hazardous Materials": [ {
		   "type": "Document exists",
		   "docType": "Register",
		   "docName": "Asbestos/Haz mat register audit"
	   }, {
		   "type": "Document exists",
		   "docType": "Register",
		   "docName": "Asbestos/Haz mat register included in induction"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Asbestos/Haz Mat Management Management plan prepared"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Occupant notification process complete"
	   } ],

	"Confined Spaces": [ {
		   "type": "Document exists",
		   "docType": "Register",
		   "docName": "Confined Spaces register available"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Confined Spaces identified and signposted"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Permit entry procedures in place"
	   } ],

	"Indoor Air Quality (IAQ)": [ {
		   "type": "Document is current",
		   "docType": "",
		   "docName": "Annual IAQ test"
	   } ],

	"Structrual/Roof Safety": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Anchor Point contract"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Height safety assessment completed"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Height safety recommendations completed"
	   }, {
		   "type": "Document exists",
		   "docType": "Audit",
		   "docName": "Façade audit/inspection"
	   } ],

	"Building Works": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Building Works Contract"
	   }, {
		   "type": "PPM schedule established",
		   "event": "PPM schedule has been established"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "BMU registration renewal"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "BMU risk assessment has been conducted"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Major maintenance routine"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "BMU registration renewal"
	   } ],

	"Dangerous Goods & Hazardous Substances": [ {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Register of dangerous goods on file"
	   }, {
		   "type": "Document exists",
		   "docType": "MSDS",
		   "docName": "MSDS available for all products"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Placarding & HAZCHEM signage is present"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Dangerous goods manifest established and accessible"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Dangerous goods license"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Dangerous goods risk review"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Emergency spill bins in place"
	   }, {
		   "type": "Document exists",
		   "docType": "Service Report",
		   "docName": "Liquid substances are bunded to requirements"
	   } ],

	"Underground Petroleum Storage Systems (UPSS)": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Underground Petroleum Storage Systems (UPSS) Contract"
	   }, {
		   "type": "Document exists",
		   "docType": "Plan",
		   "docName": "Environmental management plan prepared"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Leak detection system installed"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Leak detection log data, incl SIRA, on file"
	   }, {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Groundwater monitoring installed"
	   }, {
		   "type": "Document exists",
		   "docType": "Service Report",
		   "docName": "Decommissioning/validation test reports on file"
	   } ],

	"Radio Frequency Radiation (RFR)": [ {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Risk assessment on file"
	   }, {
		   "type": "Document exists",
		   "docType": "Procedure",
		   "docName": "Restricted access procedures in place"
	   }, {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Risk Review contract"
	   } ],

	"Environmental Risk Management": [ {
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Trade waste agreements in place"
	   }, {
		   "type": "Document exists",
		   "docType": "Register",
		   "docName": "Hazardous waste register"
	   }, {
		   "type": "Document exists",
		   "docType": "Audit",
		   "docName": "Hazardous waste removal certificates on file"
	   }, {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Grease trap disposal contract"
	   }, ],


	"OHS": [ {
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Risk audit contract"
	}, {
		"type": "Document exists",
		"docType": "Procedure",
		"docName": "Critical Environment procedures in place"
	}, {
		"type": "Document exists",
		"docType": "Audit",
		"docName": "Last audit"
	}, {
		"type": "Document exists",
		"docType": "Audit",
		"docName": "Compliant audit"
	}, {
		"type": "Document exists",
		"docType": "",
		"docName": "Slip Test"
	} ],

	"Critical Environment": [ {
		"type": "Document exists",
		"docType": "",
		"docName": "Equipment schedule"
	}, {
		"type": "Document exists",
		"docType": "Procedure",
		"docName": "Critical Environment procedures in place"
	} ],


	"Security": [ {
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Security patrols contract"
	}, {
		"type": "Document is current",
		"docType": "",
		"docName": "Incident register in place"
	} ],

	"Cleaning": [ {
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Cleaning contract"
	}, {
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Waste removal contract"
	}, {
		"type": "Document is current",
		"docType": "",
		"docName": "Cleaners test and tag up confirmation"
	} ],

	"House Rules": [ {
		"type": "Document exists",
		"docType": "House Rules",
		"docName": "Tenant receipt of House Rules"
	} ],

	"Contractor Management": [ {
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Contractor management and induction system in place"
	}, {
		"type": "Document exists",
		"docType": "Procedure",
		"docName": "Restricted access procedures"
	}, {
		"type": "Document exists",
		"docType": "Registration",
		"docName": "Contracts register operational"
	} ]
};
