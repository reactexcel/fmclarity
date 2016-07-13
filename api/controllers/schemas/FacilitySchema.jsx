FacilitySchema = {
    name: {
    	label: "Name",
    	defaultValue: "",
        autoFocus:true
    },
    type: {
    	label:"Property type",
    	size:6
    },
    size: {
    	label:"Net lettable area (m²)",
    	size:6
    },
    description: {
    	label: "Description",
    	input:"mdtextarea",
    },
    attachments: {
    	type:[Object],
    	label:"Attachments",
        input:DocAttachments.FileExplorer
    },
    documents: {
        type:[Object],
        label:"Documents",
        input:DocAttachments.DocumentExplorer
    },
    address:{
    	label:"Address",
    	schema:AddressSchema,
    },
    operatingTimes:{
        label:"Operating times"
    },
    team: {
      label: "Team",
      type: [Object],
      /*relationship:{
        "belongsTo":Teams
      }*/
    },
    members : {
        label: "Members",
        type: [Object],
    },
    levels: {
        type:[Object],
        label:"Building levels",
        defaultValue:function(){
            return JSON.parse(JSON.stringify(Config.defaultLevels));
        }
    },
    //this is really levelTypes, areas is a most confusing name for it
    areas: {
    	type:[Object],
    	label:"Building areas",
    	defaultValue:function(){
        	return JSON.parse(JSON.stringify(Config.defaultAreas));
    	}
    },
    servicesRequired: {
        type:[Object],
        label:"Services Consumed",
        defaultValue:function(){
            return JSON.parse(JSON.stringify(Config.services));
        }
    }
}