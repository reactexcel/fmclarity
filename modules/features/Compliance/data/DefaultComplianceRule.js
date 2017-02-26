export default DefaultComplianceRule = {
	"Fire Protection": [{
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		"docType": "Service Report",
		"docName": "FPS Service Report"
	}, /*{
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Sprinklers Annual"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Sprinklers 5 yearly"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Sprinklers 10 yearly"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Sprinklers 25 yearly"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Sprinklers 30 yearly"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Pumpset annual test"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Pumpset 5 yearly servicet"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Pumpset 10 yearly service"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Hydrants yearly"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Hydrants 5 yearly"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Hydrant valves Annual"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Water storage tanks Annual"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Water storage tanks Ten yearly"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Fire detection and alarm systems Annual"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Fire detection and alarm systems Five yearly"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Special hazard systems - smoke alarms Annual"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Special hazard systems - smoke alarms Ten yearly"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Lay flat hose Annual"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Hose reels Annual"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Extinguishers Annual"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Extinguishers Five yearly"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document exists",
		docType: "",
		"docName": "Extinguishers Annual condition report"
	}, */{
		"service":{
			name:"Fire Protection"
		},
		"type": "Document is current",
		docType: "Contract",
		"docName": "Fire Doors Contract"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document is current",
		docType: "Service Report",
		"docName": "Fire Doors Service reports"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "Document is current",
		"docName": "Defects rectified from fire door"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "PPM schedule established",
		"event": "Fire Doors"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "PPM schedule established"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "PPM schedule established",
		"event": "Sprinklers serviced"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "5",
			"unit": "years"
		},
		"event": "Sprinklers serviced"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "1",
			"unit": "years"
		},
		"event": "Pumpset annual test"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "1",
			"unit": "years"
		},
		"event": "Hydrants serviced"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "1",
			"unit": "months"
		},
		"event": "Hydrant valves tested"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "2",
			"unit": "years"
		},
		"event": "Water storage tanks checked"
	}, {
		"service":{
			name:"Fire Protection"
		},
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
		"type":"PPM schedule established",
		"event":"Fire Protection PPM exists for monthly maintenance"
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
		"event":"Fire Protection Sprinklers 6-monthly maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Sprinklers"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Sprinklers Annual maintenance",
		frequency: {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	},  {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Sprinklers"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Sprinklers 5 yearly  maintenance",
		frequency: {
			"number":"5",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Sprinklers"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Sprinklers 10 yearly  maintenance",
		frequency: {
			"number":"10",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Sprinklers"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Sprinklers 25 yearly  maintenance",
		frequency: {
			"number":"25",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Sprinklers"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Sprinklers 30 yearly  maintenance",
		frequency: {
			"number":"30",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Pumpsets"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Pumpsets 6-monthly maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Pumpsets"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Pumpsets Annual maintenance",
		frequency: {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Pumpsets"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Pumpsets 5 yearly  maintenance",
		frequency: {
			"number":"5",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Pumpsets"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Pumpsets 10 yearly  maintenance",
		frequency: {
			"number":"10",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Hydrants"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Hydrants Annual maintenance",
		frequency: {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Hydrants"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Hydrants 5 yearly  maintenance",
		frequency: {
			"number":"5",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Hydrant valves"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Hydrant valves 6 monthly  maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Hydrant valves"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Hydrant valves Annual maintenance",
		frequency: {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Water storage tanks"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Water storage tanks 6-monthly maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Water storage tanks"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Water storage tanks Annual maintenance",
		frequency: {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Water storage tanks"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Water storage tanks 10 yearly  maintenance",
		frequency: {
			"number":"10",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire detection and alarm systems"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Fire detection and alarm systems 6-monthly maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire detection and alarm systems"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Fire detection and alarm systems Annual maintenance",
		frequency: {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire detection and alarm systems"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Fire detection and alarm systems 5 yearly  maintenance",
		frequency: {
			"number":"5",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Special hazard systems"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Special hazard systems 6-monthly maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Special hazard systems"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Special hazard systems Annual maintenance",
		frequency: {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Special hazard systems"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Special hazard systems 10 yearly  maintenance",
		frequency: {
			"number":"10",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Lay flat hose"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Lay flat hose Annual maintenance",
		frequency: {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire hose reels"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Fire hose reels 6-monthly maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Extinguishers"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Extinguishers 6-monthly maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Extinguishers"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Extinguishers Annual maintenance",
		frequency: {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Extinguishers"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Extinguishers 5 yearly  maintenance",
		frequency: {
			"number":"5",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire Blankets"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Fire Blankets 6-monthly maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Passive Fire & Smoke Systems"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Passive Fire & Smoke Systems Quarterly maintenance**",
		frequency: {
			"number":"3",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Passive Fire & Smoke Systems"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Passive Fire & Smoke Systems 6-monthly maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Passive Fire & Smoke Systems"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Passive Fire & Smoke Systems Annual maintenance",
		frequency: {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire and smoke control features of mechanical devices"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Fire and smoke control features of mechanical devices Quarterly maintenance**",
		frequency: {
			"number":"3",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire and smoke control features of mechanical devices"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Fire and smoke control features of mechanical devices 6-monthly maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire and smoke control features of mechanical devices"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Fire and smoke control features of mechanical devices Annual maintenance",
		frequency: {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire and smoke control features of mechanical devices"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Fire and smoke control features of mechanical devices 5 yearly  maintenance",
		frequency: {
			"number":"5",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Emergency planning in facilities"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Emergency planning in facilities 6-monthly maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Emergency planning in facilities"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Emergency planning in facilities Annual maintenance",
		frequency: {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire Doors"
		},
		"type":"PPM event completed",
		"event":"Fire Protection Fire Doors 6-monthly maintenance",
		frequency: {
			"number":"6",
			"unit":"months",
			"repeats":"1"
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
		"docName":"Fire Protection contract is current"
	}, {
		"service":{
			name:"Fire Protection"
		},
		"subservice":{
			name:"Fire Doors"
		},
		"type":"PPM schedule established",
		"event":"Fire Protection PPM exists"
	}],

	"Air-conditioning": [ {
		"service":{
			name:"Air-conditioning"
		},
	   "type": "Document is current",
	   "docType": "Contract",
	   "docName": "Mechanical Services & Air-conditioning Contract"
	}, {
		"service":{
			name:"Air-conditioning"
		},
		"type": "PPM schedule established",
		"event": "Mechanical Services & Air-conditioning"
	}, {
		"service":{
			name:"Air-conditioning"
		},
		"type": "Document exists",
		"docType": "Service Report",
		"docName": "Mechanical Services & Air-conditioning Services reports"
	}, {
		"service":{
			name:"Air-conditioning"
		},
		"type": "Document exists",
		"docType": "",
		"docName": "Risk assessment (frequency??)"
	}, {
		"service":{
			name:"Air-conditioning"
		},
		"type": "Document exists",
		"docType": "",
		"docName": "Plant registraton renewal (Chiller)"
	}, {
		"service":{
			name:"Air-conditioning"
		},
		"type": "Document exists",
		"docType": "",
		"docName": "Plant registraton renewal (Pressure vessels)"
	}, {
		"service":{
			name:"Air-conditioning"
		},
		"type": "Document exists",
		"docType": "",
		"docName": "Mechanical plant risk assessment"
	}, {
		"service":{
			name:"Air-conditioning"
		},
		"type": "Document exists",
		"docType": "",
		"docName": "Compliant full function fire test (FFFT)"
	}, {
		"service":{
			name:"Air-conditioning"
		},
		"type": "Document exists",
		"docType": "",
		"docName": "Exhaust ducting clean included on contract"
	}, ],

	"Electrical Services": [ {
		"service":{
			name:"Electrical Services"
		},
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Electrical Services Contract"
	  }, {
	 	"service":{
   			name:"Electrical Services"
   		},
		"type": "PPM schedule established",
		"event": "Electrical Services"
	}, {
		"service":{
			name:"Electrical Services"
		},
		"type": "Document exists",
		"docType": "Service Report",
		"docName": "Electrical Services reports"
	}, {
		"service":{
			name:"Electrical Services"
		},
		"type": "PPM schedule established",
		"event": "Electrical Services RCD Test"
	}, {
		"service":{
			name:"Electrical Services"
		},
		"type": "PPM schedule established",
		"event": "Annual switchboard maintenance"
	}, {
		"service":{
			name:"Electrical Services"
		},
		"type": "PPM schedule established",
		"event": "Electrical system thermographic scan"
	}, {
		"service":{
			name:"Electrical Services"
		},
		"type": "PPM schedule established",
		"event": "Lightning protection annual check"
	}, {
		"service":{
			name:"Electrical Services"
		},
		"type": "PPM schedule established",
		"event": "Testing & Tagging"
	}, {
		"service":{
			name:"Electrical Services"
		},
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
		"type": "PPM schedule established",
		"event": "Electrical Services PPM exists"
	}, {
		"service":{
			name:"Electrical Services"
		},
		"type": "Document exists",
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
		"event": "Electrical Services RCDs Annual maintenance",
		"frequency": {
		    "number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Electrical Services"
		},
		"subservice":{
			name:"Switchboard"
		},
		"type": "PPM event completed",
		 "event": "Electrical Services Switchboard Annual maintenance",
		"frequency": {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
		"service":{
			name:"Electrical Services"
		},
		"subservice":{
			name:"Thermographic scan"
		},
		"type": "PPM event completed",
		"event": "Electrical Services Thermographic scan Annual maintenance",
		"frequency": {
			"number":"1",
			"unit":"years",
			"repeats":"1"
		}
	}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Lightning protection"
			},
			"type": "PPM event completed",
		 	"event": "Electrical Services Lightning protection Annual maintenance",
			"frequency": {
				"number":"1",
				"unit":"years",
				"repeats":"1"
			}
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Testing & Tagging"
			},
			"type": "PPM event completed",
		 	"event": "Testing & Tagging",
			"frequency": {
				"number":"1",
				"unit":"years",
				"repeats":"1"
			}
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"UPS"
			},
			"type": "PPM event completed",
		 	"event": "UPS maintenance",
			"frequency": {
				"number":"1",
				"unit":"years",
				"repeats":"1"
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
				"number":"6",
				"unit":"months",
				"repeats":"1"
			}
		}, {
			"service":{
				name:"Electrical Services"
			},
			"subservice":{
				name:"Emergency & Exit Lighting"
			},
			"type": "PPM event completed",
		 	"event": "Electrical Services Emergency & Exit Lighting 6-monthly maintenance",
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
			"type": "PPM schedule established",
		 	"event": "PPM schedule has been established"
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
		 	"event": "Generator Load Test",
			"frequency":{
				"number":"1",
				"unit":"years",
				"repeats":"1"
			}
		} ],
	"Generator": [ {
			"service":{
				name:"Generator"
			},
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Generator Contract"
	   }, {
		   "service":{
			   name:"Generator"
		   },
		   "type": "PPM schedule established",
		   "event": "Generator"
	   }, {
		   "service":{
			   name:"Generator"
		   },
		   "type": "Document exists",
		   "docType": "Service Report",
		   "docName": "Generator service reports on file"
	   }, {
		   "service":{
			   name:"Generator"
		   },
		   "type": "Document exists",
		   "docName": "Generator Load Test"
	   } ],

	"Emergency & Exit Lighting": [ {
			"service":{
				name:"Emergency & Exit Lighting"
			},
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Emergency & Exit Lighting Contract"
	   }, {
		   "service":{
			   name:"Emergency & Exit Lighting"
		   },
		   "type": "PPM schedule established",
		   "event": "Emergency & Exit Lighting"
	   }, {
		   "service":{
			   name:"Emergency & Exit Lighting"
		   },
		   "type": "Document exists",
		   "docType": "Service Report",
		   "docName": "Emergency & Exit Lighting service reports on file"
	   } ],

	"Water Coolers": [ {
			"service":{
				name:"Water Coolers"
			},
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Water Treatment Contract"
	   }, {
		   "service":{
			   name:"Water Coolers"
		   },
		   "type": "Document is current",
		   "docType": "Registration",
		   "docName": "Cooling tower registration"
	   }, {
		   "service":{
			   name:"Water Coolers"
		   },
		   "type": "PPM schedule established",
		   "event": "Water Treatment"
	   }, {
		   "service":{
			   name:"Water Coolers"
		   },
		   "type": "Document exists",
		   "docType": "Service Report",
		   "docName": "Water Treatment service reports on file"
	   }, {
		   "service":{
			   name:"Water Coolers"
		   },
   		   "type": "Document is current",
   		   "docType": "Contract",
   		   "docName": "Water Testing Contract"
   	   }, {
		   "service":{
			   name:"Water Coolers"
		   },
   		   "type": "Document is current",
   		   "docType": "Registration",
   		   "docName": "Water Testing registration"
   	   }, {
		   "service":{
			   name:"Water Coolers"
		   },
   		   "type": "PPM schedule established",
   		   "event": "Water Testing"
   	   }, {
		   "service":{
			   name:"Water Coolers"
		   },
   		   "type": "PPM schedule established",
   		   "event": "Water Testing Risk Management Plan date"
   	   }, {
		   "service":{
			   name:"Water Coolers"
		   },
   		   "type": "PPM schedule established",
   		   "event": "Water Testing RMP Review"
   	   }, {
		   "service":{
			   name:"Water Coolers"
		   },
   		   "type": "PPM schedule established",
   		   "event": "Water Testing RMP Audit"
   	   }, {
		   "service":{
			   name:"Water Coolers"
		   },
   		   "type": "Document exists",
   		   "docName": "Water Testing actions within RMP review addressed"
   	   } ],

	"Plumbing": [  {
			"service":{
				name:"Plumbing"
			},
			"type":"Document is current",
			"docType":"Contract",
			"docName":"Plumbing contract is current"
		},  {
			"service":{
				name:"Plumbing"
			},
		   "type": "PPM schedule established",
		   "event": "Plumbing"
	   }, {
		   "service":{
			   name:"Plumbing"
		   },
		   "type": "Document exists",
		   "docType": "Service Report",
		   "docName": "Plumbing service reports on file"
	   },  {
		   "service":{
			   name:"Plumbing"
		   },
		   "subservice":{
			   name:"Potable water tank"
		   },
		   "type":"PPM event completed",
		   "event":"Potable water tank annual clean",
		   "frequency":{
			   "number":"1",
			   "unit":"years",
			   "repeats":"1"
		   }
	   }, {
		   "service":{
			   name:"Plumbing"
		   },
		   "subservice":{
			   name:"Backflow prevention valves"
		   },
		   "type":"PPM event completed",
		   "event":"Backflow prevention valve annual maintenance date",
		   "frequency":{
			   "number":"1",
			   "unit":"years",
			   "repeats":"1"
		   }
	   }, {
		   "service":{
			   name:"Plumbing"
		   },
		   "subservice":{
			   name:"Thermostatic mixer valves"
		   },
		   "type":"PPM event completed",
		   "event":"Thermostatic mixer valves annual test "
	   }, {
		   "service":{
			   name:"Plumbing"
		   },
		   "type":"PPM schedule established",
		   "event":"PPM schedule has been established"
	   }, {
		   "service":{
			   name:"Plumbing"
		   },
		   "type":"Compliance level",
		   "docType":"Service Report",
		   "docName":"12 months' Plumbing service reports exist"
	   }, ],

	"Lifts & Escalators": [ {
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
		   "type": "Document exists",
		   "docType": "Procedure",
		   "docName": "PPM schedule has been established"
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "Document exists",
		   "docType": "Report",
		   "docName": "Service reports on file"
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Lift hazard and risk assessment completed (frequency? Ask lift consultants)"
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "Document exists",
		   "docType": "Registration",
		   "docName": "Lift registration renewal date"
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "Document exists",
		   "docType": "Audit",
		   "docName": "Lift audit conducted"
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Egress Contract"
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "PPM schedule established",
		   "event": "PPM schedule has been established"
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
		   "event": "Annual Lift/escalator audit",
		   "frequency":{
			   "number":"1",
			   "unit":"years",
			   "repeats":"1"
		   }
	   }, {
		   "service":{
			   name:"Lifts & Escalators"
		   },
		   "type": "Document exists",
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
 		   "type": "Document is current",
 		   "docType":"Report",
 		   "event": "Annual essential safety measures report (AESMR)*"
 	   }, {
		   "service":{
			   name:"Essential Safety Measures"
		   },
		   "type": "Document exists",
		   "docType":"Certificate",
		   "event": "Maintenance determination/occupancy permit on file"
	   }, {
		   "service":{
			   name:"Essential Safety Measures"
		   },
		   "type": "Document exists",
		   "docType": "Audit",
		   "docName": "Review and audit"
	   }, {
		   "service":{
			   name:"Essential Safety Measures"
		   },
		   "type": "PPM schedule established",
		   "event": "Review and audit"
	   }, {
		   "service":{
			   name:"Essential Safety Measures"
		   },
		   "type": "PPM schedule established",
		   "event": "PPM schedule has been established"
	   }, {
		   "service":{
			   name:"Essential Safety Measures"
		   },
		   "type": "PPM event completed",
		   "event": "Essential Safety Measures Annual review and audit",
		   "frequency":{
			   "number":"1",
			   "unit":"years",
			   "repeats":"1"
		   }
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
		   "type": "Document exists",
		   "docType": "Plan",
		   "docName": "Evacuation diagrams installed"
	   	}, {
			"service":{
			  	name:"Emergency Management Procedures"
		  	},
		   	"type": "Document exists",
		   	"docType": "",
		   	"docName": "Emergency evacuation training exercise"
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
	   }, {
		   "service":{
			   name:"Emergency Management Procedures"
		   },
		   "type": "PPM event completed",
		   "event": "Annual emergency evacuation training exercise",
		   "frequency":{
			   "number":"1",
			   "unit":"years",
			   "repeats":"1"
		   }
	   	}],

	"Asbestos & Hazardous Materials": [ {
			"service":{
				name:"Asbestos & Hazardous Materials"
			},
		   "type": "Document exists",
		   "docType": "Register",
		   "docName": "Asbestos/Haz mat register audit"
	   }, {
		   "service":{
			   name:"Asbestos & Hazardous Materials"
		   },
		   "type": "Document exists",
		   "docType": "Register",
		   "docName": "Asbestos/Haz mat register included in induction"
	   }, {
		   "service":{
			   name:"Asbestos & Hazardous Materials"
		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Asbestos/Haz Mat Management Management plan prepared"
	   }, {
		   "service":{
			   name:"Asbestos & Hazardous Materials"
		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Occupant notification process complete"
	   } ],

	"Confined Spaces": [ {
			"service":{
				name:"Confined Spaces"
			},
		   "type": "Document exists",
		   "docType": "Register",
		   "docName": "Confined Spaces register available"
	   }, {
		   "service":{
			   name:"Confined Spaces"
		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Confined Spaces identified and signposted"
	   }, {
		   "service":{
			   name:"Confined Spaces"
		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Permit entry procedures in place"
	   } ],

	"Indoor Air Quality (IAQ)": [ {
			"service":{
				name:"Indoor Air Quality (IAQ)"
			},
		   "type": "Document is current",
		   "docType": "",
		   "docName": "Annual IAQ test"
	   } ],

	"Structrual/Roof Safety": [ {
			"service":{
				name:"Structrual/Roof Safety"
			},
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Anchor Point contract"
	   }, {
		   "service":{
			   name:"Structrual/Roof Safety"
		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Height safety assessment completed"
	   }, {
		   "service":{
			   name:"Structrual/Roof Safety"
		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Height safety recommendations completed"
	   }, {
		   "service":{
			   name:"Structrual/Roof Safety"
		   },
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
   		   "type": "PPM schedule established",
   		   "event": "Building Maintenance Unit PPM exists"
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
		   "event": "Major maintenance routine"
	   }, {
		   "service":{
   			   name:"Building Maintenance Unit"
   		   },
		   "type": "Document is current",
		   "docType": "Registration",
		   "docName": "BMU registration"
	   } ],

	"Dangerous Goods & Hazardous Substances": [ {
			"service":{
				name:"Dangerous Goods & Hazardous Substances"
			},
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Register of dangerous goods on file"
	   }, {
		   "service":{
			   name:"Dangerous Goods & Hazardous Substances"
		   },
		   "type": "Document exists",
		   "docType": "MSDS",
		   "docName": "MSDS available for all products"
	   }, {
		   "service":{
			   name:"Dangerous Goods & Hazardous Substances"
		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Placarding & HAZCHEM signage is present"
	   }, {
		   "service":{
			   name:"Dangerous Goods & Hazardous Substances"
		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Dangerous goods manifest established and accessible"
	   }, {
		   "service":{
			   name:"Dangerous Goods & Hazardous Substances"
		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Dangerous goods license"
	   }, {
		   "service":{
			   name:"Dangerous Goods & Hazardous Substances"
		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Dangerous goods risk review"
	   }, {
		   "service":{
			   name:"Dangerous Goods & Hazardous Substances"
		   },
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Emergency spill bins in place"
	   }, {
		   "service":{
			   name:"Dangerous Goods & Hazardous Substances"
		   },
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
			"service":{
				name:"Radio Frequency Radiation (RFR)"
			},
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Risk assessment on file"
	   }, {
		   "service":{
			   name:"Radio Frequency Radiation (RFR)"
		   },
		   "type": "Document exists",
		   "docType": "Procedure",
		   "docName": "Restricted access procedures in place"
	   }, {
		   "service":{
			   name:"Radio Frequency Radiation (RFR)"
		   },
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Risk Review contract"
	   } ],

	"Environmental Risk Management": [ {
			"service":{
				name:"Environmental Risk Management"
			},
		   "type": "Document exists",
		   "docType": "",
		   "docName": "Trade waste agreements in place"
	   }, {
		   "service":{
			   name:"Environmental Risk Management"
		   },
		   "type": "Document exists",
		   "docType": "Register",
		   "docName": "Hazardous waste register"
	   }, {
		   "service":{
			   name:"Environmental Risk Management"
		   },
		   "type": "Document exists",
		   "docType": "Audit",
		   "docName": "Hazardous waste removal certificates on file"
	   }, {
		   "service":{
			   name:"Environmental Risk Management"
		   },
		   "type": "Document is current",
		   "docType": "Contract",
		   "docName": "Grease trap disposal contract"
	   }, ],


	"OHS": [ {
		"service":{
			name:"OHS"
		},
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Risk audit contract"
	}, {
		"service":{
			name:"OHS"
		},
		"type": "Document exists",
		"docType": "Procedure",
		"docName": "Critical Environment procedures in place"
	}, {
		"service":{
			name:"OHS"
		},
		"type": "Document exists",
		"docType": "Audit",
		"docName": "Last audit"
	}, {
		"service":{
			name:"OHS"
		},
		"type": "Document exists",
		"docType": "Audit",
		"docName": "Compliant audit"
	}, {
		"service":{
			name:"OHS"
		},
		"type": "Document exists",
		"docType": "",
		"docName": "Slip Test"
	} ],

	"Critical Environment": [ {
		"service":{
			name:"Critical Environment"
		},
		"type": "Document exists",
		"docType": "",
		"docName": "Equipment schedule"
	}, {
		"service":{
			name:"Critical Environment"
		},
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
		"service":{
			name:"House Rules"
		},
		"type": "Document exists",
		"docType": "House Rules",
		"docName": "Tenant receipt of House Rules"
	} ],

	"Contractor Management": [ {
		"service":{
			name:"Contractor Management"
		},
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Contractor management and induction system in place"
	}, {
		"service":{
			name:"Contractor Management"
		},
		"type": "Document exists",
		"docType": "Procedure",
		"docName": "Restricted access procedures"
	}, {
		"service":{
			name:"Contractor Management"
		},
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
		"type":"PPM schedule established",
		"event":"HVAC PPM exists"
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
		"type":"Document exists",
		"docType":"SWMS",
		"docName":"Risk assessment exists"
	}, {
		"service":{
			name:"HVAC"
		},
		"type":"PPM event completed",
		"event":"HVAC Full function fire test",
		"frequency": {
			"number":"1",
			"unit":"years",
			"repeats":"1"
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
		"event":"HVAC Kitchen Exhausts Annual maintenance",
		"frequency": {
			"number":"1",
			"unit":"years",
			"repeats":"1"
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
		"type":"PPM schedule established",
		"event":"PPM schedule has been established"
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
		"type":"PPM schedule established",
		"event":"PPM schedule has been established"
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
		"type":"Document exists",
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
		"type":"Document exists",
		"docType":"Register",
		"docName":"Asbestos/Haz mat register included in induction"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Asbestos & Hazardous Materials"
		},
		"type":"Document exists",
		"docType":"Management Plan",
		"docName":"Asbestos/Haz Mat Management Management plan prepared"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Asbestos & Hazardous Materials"
		},
		"type":"Document exists",
		"docType":"Procedure",
		"docName":"Occupant notification process complete"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Confined Spaces"
		},
		"type":"Document exists",
		"docType":"Register",
		"docName":"Confined Spaces register available"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Confined Spaces"
		},
		"type":"Document exists",
		"docType":"Confirmation",
		"docName":"Confined Spaces identified and signposted"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Confined Spaces"
		},
		"type":"Document exists",
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
		"type":"Document exists",
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
		"type":"Document exists",
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
		"type":"Document exists",
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
		"type":"Document exists",
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
		"type":"Document exists",
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
		"type":"Document exists",
		"docType":"Assessment",
		"docName":"Risk assessment on file"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Radio Frequency Radiation"
		},
		"type":"Document exists",
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
		"type":"Document exists",
		"docType":"Register",
		"docName":"Hazardous waste register"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Hazardous Waste"
		},
		"type":"Document exists",
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
		"type":"Document exists",
		"docType":"Audit",
		"docName":"Critical Environment audit completed"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Critical Environment"
		},
		"type":"Document exists",
		"docType":"Register",
		"docName":"Equipment schedule"
	}, {
		"service":{
			name:"WHS & Risk Management"
		},
		"subservice":{
			name:"Critical Environment"
		},
		"type":"Document exists",
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
		"type":"Document exists",
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
		"type":"Document exists",
		"docType":"Report",
		"docName":"Height safety assessment"
	}, {
		"service":{
			name:"High Access"
		},
		"subservice":{
			name:"Height safety"
		},
		"type":"Document exists",
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
