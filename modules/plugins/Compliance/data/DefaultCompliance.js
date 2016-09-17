export default DefaultCompliance = [ {
	"Fire protection": [ {
		"type": "Document is current",
		"docType": "Contract",
		"docName": "FPS Contract"
	}, {
		"type": "Document exists",
		"docType": "Service Report",
		"docName": "FPS Service Report"
	}, {
		"type": "PPM schedule established"
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
	"Plumbing": [ {
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Plumbing Contract"
	}, {
		"type": "Document exists",
		"docType": "Service Report",
		"docName": "Plumbing Service Report"
	}, {
		"type": "PPM schedule established",
	}, {
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "3",
			"unit": "months"
		},
		"event": "Portable water tank annual clean",
	}, {
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "3",
			"unit": "years"
		},
		"event": "Backflow prevention valve annual maintenence",
	}, {
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "4",
			"unit": "years"
		},
		"event": "Thermostatic mixer valves annual test",
		"service": {
			"name": "Plumbing"
		}
	} ],

	"Lifts": [ {
		"type": "Document is current",
		"docType": "Contract",
		"docName": "Lift Servicing Contract",
	}, {
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "1",
			"unit": "years"
		},
		"event": "Lift hazard and risk assessment",
	}, {
		"type": "PPM event completed",
		"frequency": {
			"repeats": "6",
			"number": "6",
			"unit": "months"
		},
		"event": "Lift audit",
	} ]
} ]
