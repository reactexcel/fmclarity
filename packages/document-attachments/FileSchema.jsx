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
				"Plans",
				"Inductions",
				"House Rules",
				"Inspections",
				"Audits",
				"SWMS",
				"Service Reports",
				"Quotes",
				"MSDS",
				"Budgets",
				"Contracts",
				"Emergency Management",
				"Registers",
				"Registrations",
				"Procedures"
			]
		}
	},
    description: {
     	label:"Description",
     	input:"mdtextarea"
    },
    expiry: {
    	type:Date,
    	defaultValue:function(item) {
    		return new Date();
    	},
     	label:"Document expiry",
     	input:"date",
    }
}