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
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type":"Document is current",
		"docType":"Contract",
		"docName":"Fire Protection contract is current"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type":"PPM exists",
		"docName":"Fire Protection PPM exists for monthly maintenance"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type":"Compliance level",
		"docType":"Service Report",
		"docName":"12 months' Fire Protection service reports exist"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Sprinklers"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Sprinklers 6-monthly maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Sprinklers"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Sprinklers Annual maintenance",
		frequency: {

		}
	},  {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Sprinklers"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Sprinklers 5 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Sprinklers"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Sprinklers 10 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Sprinklers"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Sprinklers 25 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Sprinklers"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Sprinklers 30 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Pumpsets"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Pumpsets 6-monthly maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Pumpsets"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Pumpsets Annual maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Pumpsets"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Pumpsets 5 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Pumpsets"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Pumpsets 10 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Hydrants"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Hydrants Annual maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Hydrants"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Hydrants 5 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Hydrant valves"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Hydrant valves 6 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Hydrant valves"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Hydrant valves Annual maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Water storage tanks"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Water storage tanks 6-monthly maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Water storage tanks"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Water storage tanks Annual maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Water storage tanks"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Water storage tanks 10 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire detection and alarm systems"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Fire detection and alarm systems 6-monthly maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire detection and alarm systems"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Fire detection and alarm systems Annual maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire detection and alarm systems"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Fire detection and alarm systems 5 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Special hazard systems"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Special hazard systems 6-monthly maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Special hazard systems"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Special hazard systems Annual maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Special hazard systems"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Special hazard systems 10 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Lay flat hose"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Lay flat hose Annual maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire hose reels"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Fire hose reels 6-monthly maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Extinguishers"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Extinguishers 6-monthly maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Extinguishers"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Extinguishers Annual maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Extinguishers"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Extinguishers 5 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire Blankets"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Fire Blankets 6-monthly maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Passive Fire & Smoke Systems"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Passive Fire & Smoke Systems Quarterly maintenance**",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Passive Fire & Smoke Systems"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Passive Fire & Smoke Systems Annual maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire and smoke control features of mechanical devices"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Fire and smoke control features of mechanical devices Quarterly maintenance**",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire and smoke control features of mechanical devices"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Fire and smoke control features of mechanical devices 6-monthly maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire and smoke control features of mechanical devices"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Fire and smoke control features of mechanical devices Annual maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire and smoke control features of mechanical devices"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Fire and smoke control features of mechanical devices 5 yearly  maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Emergency planning in facilities"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Emergency planning in facilities 6-monthly maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Emergency planning in facilities"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Emergency planning in facilities Annual maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire Doors"
		},
		"type":"PPM event completed",
		"docName":"Fire Protection Fire Doors 6-monthly maintenance",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire Doors"
		},
		"type":"Document is current",
		"docType":"Contract",
		"docName":"Fire Protection contract is current",
		frequency: {

		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire Doors"
		},
		"type":"PPM exists",
		"docName":"Fire Protection PPM exists",
		frequency: {

		}
	}],

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

	"Electrical Services": [ {
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
		}, {
			"service":{
				name:"Electrical Services"
			},
			"type": "Document is current",
			"docType": "Contract",
		 	"docName": "Electrical Services contract is current"
		}, {
			"service":{
				name:"Electrical Services"
			},
			"type": "PPM exists",
		 	"docName": "Electrical Services PPM exists"
		}, {
			"service":{
				name:"Electrical Services"
			},
			"type": "Documents exist",
			"docType":"SWMS",
		 	"docName": "Risk assessment exists"
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"RCDs"
			},
			"type": "PPM event completed",
		 	"docName": "Electrical Services RCDs Annual maintenance",
			"frequency": {

			}
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Switchboard"
			},
			"type": "PPM event completed",
		 	"docName": "Electrical Services Switchboard Annual maintenance",
			"frequency": {

			}
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Thermographic scan"
			},
			"type": "PPM event completed",
		 	"docName": "Electrical Services Thermographic scan Annual maintenance",
			"frequency": {

			}
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Lightning protection"
			},
			"type": "PPM event completed",
		 	"docName": "Electrical Services Lightning protection Annual maintenance",
			"frequency": {

			}
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Testing & Tagging"
			},
			"type": "PPM event completed",
		 	"docName": "Testing & Tagging",
			"frequency": {

			}
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"UPS"
			},
			"type": "PPM event completed",
		 	"docName": "UPS maintenance",
			"frequency": {

			}
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Emergency & Exit Lighting"
			},
			"type": "Document is current",
			"docType":"Contract",
		 	"docName": "Electrical Services contract is current",
			"frequency": {

			}
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Emergency & Exit Lighting"
			},
			"type": "PPM event completed",
		 	"docName": "Electrical Services Emergency & Exit Lighting 6-monthly maintenance",
			"frequency": {

			}
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Generator"
			},
			"type": "Document is current",
			"docType":"Contract",
		 	"docName": "Electrical Services contract is current"
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Generator"
			},
			"type": "PPM exists",
		 	"docName": "PPM schedule has been established"
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Generator"
			},
			"type": "Compliance level",
			"docType":"Service Report",
		 	"docName": "12 months' Electrical service reports exist"
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Generator"
			},
			"type": "PPM event completed",
		 	"docName": "Generator Load Test",
			"frequency":{

			}
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
	   }, {
		   "service":{
			   name:"Plumbing"
		   },
		   "type":"Document is current",
		   "docType":"Contract",
		   "docName":"Plumbing contract is current"
	   }, {
		   "service":{
			   name:"Plumbing"
		   },
		   "type":"PPM exists",
		   "docName":"PPM schedule has been established"
	   }, {
		   "service":{
			   name:"Plumbing"
		   },
		   "type":"Compliance level",
		   "docType":"Service Report",
		   "docName":"12 months' Plumbing service reports exist"
	   }, {
		   "service":{
			   name:"Plumbing"
		   },
		   "subservice":{
			   name:"Potable water tank"
		   },
		   "type":"PPM event completed",
		   "docName":"Potable water tank annual clean",
		   "frequency":{

		   }
	   }, {
		   "service":{
			   name:"Plumbing"
		   },
		   "subservice":{
			   name:"Backflow prevention valves"
		   },
		   "type":"PPM event completed",
		   "docName":"Backflow prevention valve annual maintenance date",
		   "frequency":{

		   }
	   }, {
		   "service":{
			   name:"Plumbing"
		   },
		   "subservice":{
			   name:"Thermostatic mixer valves"
		   },
		   "type":"PPM event completed",
		   "docName":"Thermostatic mixer valves annual test "
	   } ],

	"Lifts & Escalators": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Lifts & Escalators Contract"
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
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Lifts & Escalators contract is current"
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "PPM exists",
		   "docName": "PPM schedule has been established"
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "Compliance level",
		   "docType":"Service Report",
		   "docName": "12 months' Lifts & Escalators service reports exist"
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "PPM event completed",
		   "docName": "Annual Lift/escalator audit",
		   "frequency":{

		   }
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "Documents exist",
		   "docType":"Audit",
		   "docName": "Lift/escalator audit"
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "Document is current",
		   "docType":"Registration",
		   "docName": "Lift registration renewal date"
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
	   }, {
		   "service":{
			   name:"Essential Safety Measures"
		   },
		   "type": "Document is current",
		   "docType":"Contract",
		   "event": "Essential Safety Measures contract is current"
	   }, {
		   "service":{
			   name:"Essential Safety Measures"
		   },
		   "type": "PPM exists",
		   "event": "PPM schedule has been established"
	   }, {
		   "service":{
			   name:"Essential Safety Measures"
		   },
		   "type": "PPM event completed",
		   "event": "Essential Safety Measures Annual review and audit",
		   "frequency":{

		   }
	   }, {
		   "service":{
			   name:"Essential Safety Measures"
		   },
		   "type": "Document is current",
		   "docType":"Report",
		   "event": "Annual essential safety measures report (AESMR)*"
	   }, {
		   "service":{
			   name:"Essential Safety Measures"
		   },
		   "type": "Documents exist",
		   "docType":"Certificate",
		   "event": "Maintenance determination/occupancy permit on file"
	   }, {
		   "service":{
			   name:"Essential Safety Measures"
		   },
		   "subservice":{
			   name:"Egress"
		   },
		   "type": "Document is current",
		   "docType":"Contract",
		   "event": "Essential Safety Measures contract is current"
	   } ],

	"Emergency Management Procedures": [ {
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Emergency Management Procedures Contract"
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
	   }, {
		   "service":{
			   name:"Emergency Management Procedures"
		   },
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Emergency Management Procedures contract is current"
	   }, {
		   "service":{
			   name:"Emergency Management Procedures"
		   },
		   "type": "Document is current",
		   "docType": "Procedure",
		   "docName": "Emergency Response Procedures prepared"
	   }, {
		   "service":{
			   name:"Emergency Management Procedures"
		   },
		   "type": "Documents exist",
		   "docType": "Plan",
		   "docName": "Evacuation diagrams installed"
	   }, {
		   "service":{
			   name:"Emergency Management Procedures"
		   },
		   "type": "PPM event completed",
		   "docName": "Annual emergency evacuation training exercise",
		   "frequency":{

		   }
	   }, {
		   "service":{
			   name:"Emergency Management Procedures"
		   },
		   "type": "Document is current",
		   "docType": "Log",
		   "docSubType":"Warden training",
		   "docName": "Warden training log"
	   }, {
		   "service":{
			   name:"Emergency Management Procedures"
		   },
		   "type": "Document is current",
		   "docType": "Log",
		   "docSubType":"Chief Warden training",
		   "docName": "Chief warden training log"
	   }, {
		   "service":{
			   name:"Emergency Management Procedures"
		   },
		   "type": "Document is current",
		   "docType": "Register",
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

	"Building Maintenance Unit": [ {
		   "service":{
			   name:"Building Maintenance Unit"
		   },
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Building Maintenance Unit Contract is current"
	   }, {
   		   "service":{
   			   name:"Building Maintenance Unit"
   		   },
   		   "type": "PPM exists",
   		   "docName": "Building Maintenance Unit PPM exists"
   	   }, {
		   "service":{
			  name:"Building Maintenance Unit"
		  },
		   "type": "PPM schedule established",
		   "event": "PPM schedule has been established"
	   }, {
		   "service":{
   			   name:"Building Maintenance Unit"
   		   },
		   "type": "Document is current",
		   "docType": "Registration",
		   "docName": "BMU registration renewal"
	   }, {
		   "service":{
   			   name:"Building Maintenance Unit"
   		   },
		   "type": "Document is current",
		   "docType": "Assessment",
		   "docName": "BMU risk assessment has been conducted"
	   }, {
		   "service":{
   			   name:"Building Maintenance Unit"
   		   },
		   "type": "PPM event completed",
		   "docName": "Major maintenance routine"
	   }, {
		   "service":{
   			   name:"Building Maintenance Unit"
   		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "BMU registration renewal"
	   }, {
		   "service":{
   			   name:"Building Maintenance Unit"
   		   },
		   "type": "Document is current",
		   "docType": "Registration",
		   "docName": "BMU registration"
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
			"service":{
				name:"Underground Petroleum Storage Systems (UPSS)"
			},
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Underground Petroleum Storage Systems (UPSS) Contract is current"
	   }, {
		   "service":{
			   name:"Underground Petroleum Storage Systems (UPSS)"
		   },
		   "type": "Document is current",
		   "docType": "Management Plan",
		   "docName": "Environmental management plan prepared"
	   }, {
		   "service":{
			   name:"Underground Petroleum Storage Systems (UPSS)"
		   },
		   "subservice":{
			   name:"Leak detection"
		   },
		   "type": "Document is current",
		   "docType": "Report",
		   "docSubType":"Validation Report",
		   "docName": "Leak detection system installed"
	   }, {
		   "service":{
			   name:"Underground Petroleum Storage Systems (UPSS)"
		   },
		   "subservice":{
			   name:"Leak detection"
		   },
		   "type": "Document is current",
		   "docType": "Log",
		   "docName": "Leak detection log data, incl SIRA, on file"
	   }, {
		   	"service":{
			   	name:"Underground Petroleum Storage Systems (UPSS)"
		   	},
		   	"subservice":{
			    name:"Groundwater monitoring"
		   	},
		   	"type": "Document is current",
		   	"docType": "Report",
			"docSubType":"Validation Report",
		   	"docName": "Groundwater monitoring installed"
	   }, {
		   "service":{
			   name:"Underground Petroleum Storage Systems (UPSS)"
		   },
		   "type": "Document is current",
		   "docType": "Report",
		   "docSubType":"Validation Report",
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
		"service":{
			name:"Security"
		},
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Security contract is current"
	}, {
		"service":{
			name:"Security"
		},
		"type": "Document exists",
		"docType": "Register",
		"docSubType":"Incident register",
		"docName": "Incident register in place"
	} ],

	"Cleaning": [ {
		"service":{
			name:"Cleaning"
		},
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Cleaning contract is current"
	}, {
		"service":{
			name:"Cleaning"
		},
		"subservice":{
			name:"Waste removal"
		},
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Cleaning contract is current"
	}, {
		"service":{
			name:"Cleaning"
		},
		"type": "Document is current",
		"docType": "Registration",
		"docSubType":"Testing & Tagging certificate",
		"docName": "Cleaning Test and Tag certificate current"
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
	} ],

	"HVAC": [ {
		"service":{
			name:"HVAC"
		},
		"type":"Document is current",
		"docType":"Contract",
		"docName":"HVAC contract is current"
	}, {
		"service":{
			name:"HVAC"
		},
		"type":"PPM exists",
		"docName":"HVAC PPM exists"
	}, {
		"service":{
			name:"HVAC"
		},
		"type":"Compliance level",
		"docType":"Service Report",
		"docName":"12 months' HVAC service reports exist"
	}, {
		"service":{
			name:"HVAC"
		},
		"type":"Documents exist",
		"docType":"SWMS",
		"docName":"Risk assessment exists"
	}, {
		"service":{
			name:"HVAC"
		},
		"type":"PPM event completed",
		"docName":"HVAC Full function fire test",
		"frequency": {

		}
	}, {
		"service":{
			name:"HVAC"
		},
		"subservice":{
			name:"Chillers"
		},
		"type":"Document is current",
		"docType":"Registration",
		"docName":"Plant registraton renewal (Chiller)"
	}, {
		"service":{
			name:"HVAC"
		},
		"subservice":{
			name:"Pressure Vessels"
		},
		"type":"Document is current",
		"docType":"Registration",
		"docName":"Plant registraton renewal (Pressure vessels)"
	}, {
		"service":{
			name:"HVAC"
		},
		"subservice":{
			name:"Kitchen Exhausts"
		},
		"type":"PPM event completed",
		"docName":"HVAC Kitchen Exhausts Annual maintenance",
		"frequency": {

		}
	}],

	"Cooling Tower Systems & Water Treatment":[{
		"service":{
			name:"Cooling Tower Systems & Water Treatment"
		},
		"subservice":{
			name:"Water Treatment"
		},
		"type":"Document is current",
		"docType":"Contract",
		"docName":"Cooling Tower Systems & Water Treatment contract is current"
	}, {
		"service":{
			name:"Cooling Tower Systems & Water Treatment"
		},
		"subservice":{
			name:"Water Treatment"
		},
		"type":"PPM exists",
		"docName":"PPM schedule has been established"
	}, {
		"service":{
			name:"Cooling Tower Systems & Water Treatment"
		},
		"subservice":{
			name:"Water Treatment"
		},
		"type":"Compliance level",
		"docType":"Service Report",
		"docName":"12 months' Cooling Tower Systems & Water Treatment service reports exist"
	}, {
		"service":{
			name:"Cooling Tower Systems & Water Treatment"
		},
		"type":"Document is current",
		"docType":"Registration",
		"docName":"Cooling tower registration expiry date"
	}, {
		"service":{
			name:"Cooling Tower Systems & Water Treatment"
		},
		"subservice":{
			name:"Water Testing"
		},
		"type":"Document is current",
		"docType":"Contract",
		"docName":"Cooling Tower Systems & Water Treatment contract is current"
	}, {
		"service":{
			name:"Cooling Tower Systems & Water Treatment"
		},
		"subservice":{
			name:"Water Testing"
		},
		"type":"PPM exists",
		"docName":"PPM schedule has been established"
	}, {
		"service":{
			name:"Cooling Tower Systems & Water Treatment"
		},
		"subservice":{
			name:"Water Testing"
		},
		"type":"Compliance level",
		"docType":"Service Report",
		"docName":"12 months' Cooling Tower Systems & Water Treatment service reports exist"
	}, {
		"service":{
			name:"Cooling Tower Systems & Water Treatment"
		},
		"subservice":{
			name:"RMP"
		},
		"type":"Document is current",
		"docType":"Management Plan",
		"docName":"Risk Management Plan (RMP)"
	}, {
		"service":{
			name:"Cooling Tower Systems & Water Treatment"
		},
		"subservice":{
			name:"RMP"
		},
		"type":"Document is current",
		"docType":"Assessment",
		"docName":"RMP Review"
	}, {
		"service":{
			name:"Cooling Tower Systems & Water Treatment"
		},
		"subservice":{
			name:"RMP"
		},
		"type":"Document is current",
		"docType":"Confirmation",
		"docName":"RMP review compliant"
	}, {
		"service":{
			name:"Cooling Tower Systems & Water Treatment"
		},
		"subservice":{
			name:"RMP"
		},
		"type":"Document is current",
		"docType":"Audit",
		"docName":"RMP Audit"
	}],

	"Utilities": [{
		"service":{
			name:"Utilities"
		},
		"subservice":{
			name:"Energy Management"
		},
		"type":"Document is current",
		"docType":"Certificate",
		"docName":"Building Energy Efficiency Certificate"
	}, {
		"service":{
			name:"Utilities"
		},
		"subservice":{
			name:"Energy Management"
		},
		"type":"Compliance level",
		"docType":"Invoice",
		"docName":"12 months' Utilities invoices exist"
	}],

	"WHS & Risk Management":[{
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Property risk"
		},
		"type":"Documents exist",
		"docType":"Certificate",
		"docSubType":"Certificate of Occupancy",
		"docName":"Cert of Occupancy/Final Inspection/ESM determination"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Property risk"
		},
		"type":"Document is current",
		"docType":"Contract",
		"docName":"WHS & Risk Management Property risk contract is current"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Property risk"
		},
		"type":"Document is current",
		"docType":"Audit",
		"docName":"Last audit"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Property risk"
		},
		"type":"Document is current",
		"docType":"Audit",
		"docName":"Last audit"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Property risk"
		},
		"type":"Document is current",
		"docType":"Confirmation",
		"docName":"Compliant audit"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Slip test"
		},
		"type":"Document is current",
		"docType":"Report",
		"docName":"Slip Test"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Slip test"
		},
		"type":"Document is current",
		"docType":"Confirmation",
		"docName":"Slip test compliance"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Asbestos & Hazardous Materials"
		},
		"type":"Document is current",
		"docType":"Audit",
		"docName":"Asbestos/Haz mat register audit"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Asbestos & Hazardous Materials"
		},
		"type":"Documents exist",
		"docType":"Register",
		"docName":"Asbestos/Haz mat register included in induction"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Asbestos & Hazardous Materials"
		},
		"type":"Documents exist",
		"docType":"Management Plan",
		"docName":"Asbestos/Haz Mat Management Management plan prepared"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Asbestos & Hazardous Materials"
		},
		"type":"Documents exist",
		"docType":"Procedure",
		"docName":"Occupant notification process complete"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Confined Spaces"
		},
		"type":"Documents exist",
		"docType":"Register",
		"docName":"Confined Spaces register available"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Confined Spaces"
		},
		"type":"Documents exist",
		"docType":"Confirmation",
		"docName":"Confined Spaces identified and signposted"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Confined Spaces"
		},
		"type":"Documents exist",
		"docType":"Procedure",
		"docName":"Permit entry procedures in place"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Indoor Air Quality"
		},
		"type":"Document is current",
		"docType":"Report",
		"docName":"Annual IAQ test"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Dangerous Goods & Hazardous Substances"
		},
		"type":"Documents exist",
		"docType":"Register",
		"docName":"Dangerous goods register"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Dangerous Goods & Hazardous Substances"
		},
		"type":"Document is current",
		"docType":"MSDS",
		"docName":"MSDS available"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Dangerous Goods & Hazardous Substances"
		},
		"type":"Documents exist",
		"docType":"Confirmation",
		"docSubType":"Signage",
		"docName":"Signage in place"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Dangerous Goods & Hazardous Substances"
		},
		"type":"Documents exist",
		"docType":"Confirmation",
		"docSubType":"Manifest",
		"docName":"Dangerous goods manifest in-situ"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Dangerous Goods & Hazardous Substances"
		},
		"type":"Document is current",
		"docType":"Licence",
		"docName":"Dangerous goods license"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Dangerous Goods & Hazardous Substances"
		},
		"type":"Document is current",
		"docType":"Assessment",
		"docName":"Dangerous goods risk review"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Dangerous Goods & Hazardous Substances"
		},
		"type":"Documents exist",
		"docType":"Confirmation",
		"docSubType":"Spill bins",
		"docName":"Emergency spill bins in place"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Dangerous Goods & Hazardous Substances"
		},
		"type":"Documents exist",
		"docType":"Confirmation",
		"docSubType":"Bunding",
		"docName":"Liquid substances are bunded to requirements"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Radio Frequency Radiation"
		},
		"type":"Documents exist",
		"docType":"Assessment",
		"docName":"Risk assessment on file"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Radio Frequency Radiation"
		},
		"type":"Documents exist",
		"docType":"Procedure",
		"docName":"Restricted access procedures in place"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Radio Frequency Radiation"
		},
		"type":"Document is current",
		"docType":"Contract",
		"docName":"WHS & Risk Management contract is current"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Trade Waste"
		},
		"type":"Document is current",
		"docType":"Contract",
		"docName":"Trade waste agreements in place"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Hazardous Waste"
		},
		"type":"Documents exist",
		"docType":"Register",
		"docName":"Hazardous waste register"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Hazardous Waste"
		},
		"type":"Documents exist",
		"docType":"Certificate",
		"docName":"Hazardous waste removal certificates on file"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Grease trap disposal"
		},
		"type":"Document is current",
		"docType":"Contract",
		"docName":"WHS & Risk Management contract is current"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Critical Environment"
		},
		"type":"Documents exist",
		"docType":"Audit",
		"docName":"Critical Environment audit completed"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Critical Environment"
		},
		"type":"Documents exist",
		"docType":"Register",
		"docName":"Equipment schedule"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Critical Environment"
		},
		"type":"Documents exist",
		"docType":"Procedure",
		"docName":"Critical Environment procedures in place"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"House Rules"
		},
		"type":"Compliance level",
		"docType":"Confirmation",
		"docName":"Tenant(s) confirmation of House Rules"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Contractor Management"
		},
		"type":"Compliance level",
		"docType":"Induction",
		"docName":"All contractors are inducted"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Contractor Management"
		},
		"type":"Documents exist",
		"docType":"Procedure",
		"docSubType":"Restricted access",
		"docName":"Restricted access procedures"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Contractor Management"
		},
		"type":"Compliance level",
		"docType":"Contract",
		"docName":"Contracts  <50% complete"
	}],

	"High Access":[{
		"service":{
			name:"High Access"
		},
		"subservice":{
			name:"Anchor points"
		},
		"type":"Document is current",
		"docType":"Contract",
		"docName":"High Access contract is current"
	}, {
		"service":{
			name:"High Access"
		},
		"subservice":{
			name:"Height safety"
		},
		"type":"Documents exist",
		"docType":"Report",
		"docName":"Height safety assessment"
	}, {
		"service":{
			name:"High Access"
		},
		"subservice":{
			name:"Height safety"
		},
		"type":"Documents exist",
		"docType":"Service Report",
		"docName":"Height safety recommendations completed"
	}, {
		"service":{
			name:"High Access"
		},
		"subservice":{
			name:"Façade"
		},
		"type":"Document is current",
		"docType":"Audit",
		"docName":"Façade audit/inspection"
	}]
};
