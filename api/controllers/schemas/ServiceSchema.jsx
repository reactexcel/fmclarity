ComplianceRuleSchema = {
    service:{
    	type:Object,
    },
    type: {
    	label:"Rule type",
    	input:"MDSelect",
    	options:{
    		items:[
    			"Contract expiry",				//verify existence of ppm contract
    			"PPM schedule established",		//verify existence of ppm events
    			"Service reports on file",		//verify service reports for all ppm items
    			"PPM event",					//individual event
    		]
    	}
    },
    name: {
    	label: "Rule name",
    	defaultValue: ""
    },



}