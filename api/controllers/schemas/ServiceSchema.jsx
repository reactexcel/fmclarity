import '../../../imports/ui/Facility/MDFacilitySelector.jsx';
import '../../../imports/ui/Facility/MDPPMEventSelector.jsx';

ComplianceRuleSchema = {
	facility:{
		type:Object,
		input:MDFacilitySelector
	},
    service:{
    	type:Object,
    	input:MDServiceSelector
    },
    category:{
    	label:"Compliance category"
    },
    type: {
    	label:"Check type",
    	input:"MDSelect",
    	options:{
    		items:[
    			"Document exists",
    			"Document is current",
    			"PPM schedule established",
    			"PPM event completed",
    		]
    	}
    },
    docType:{
    	label:"Document type",
    	input:"MDSelect",
    	options:{
    		items:DocTypes
    	},
    	condition:function(item){
    		return item.type=="Document exists"||item.type=="Document is current"
    	}
    },
    docName:{
    	label:"Document name",
    	condition:function(item){
    		return item.type=="Document exists"||item.type=="Document is current"
    	}
    },
    event:{
    	label:"PMP event",
    	condition:function(item) {
    		return item.type=="PPM event completed"
    	},
    	input:MDPPMEventSelector,
    	options:function(item){
    		return {
    			facility:item.facility
    		}
    	}
    }
}