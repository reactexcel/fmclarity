FileSchema = {
	file:{
		type:[Object],
		condition:function(){
			return false;
		}
	},
    name: {
     	label:"Name",
     	input:"mdtext",
		size:6,
    },
	type: {
		label:"File type",
		size:6,
		type:String,
		input:"MDSelect",
		options:{
			items:[
				"Audit",
				"Budget",
				"Contract",
				"Emergency Management",
				"House Rules",
				"Induction",
				"Inspection",
				"Insurance",
				"MSDS",
				"Plan",
				"Procedure",
				"Quote",
				"Register",
				"Registration",
				"Service Report",
				"SWMS",
			]
		}
	},
    description: {
     	label:"Description",
     	input:"mdtextarea"
    },
    expiry: {
    	type:Date,
    	condition:function(item){
    		return item.type=="Insurance";
    	},
    	defaultValue:function(item) {
    		return new Date();
    	},
     	label:"Document expiry",
     	input:"date",
    }
}