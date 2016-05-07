SecurityDeposit = {
	purpose:{
		label:"Purpose",
	},
	amountRequired:{
		label:"Amount required",
		size:6,
	},
	amountHeld:{
		label:"Amount held",
		size:6,
	},
	bankName:{
		label:"Bank name",
		size:6,
	},
	reviewDate:{
		label:"Review date",
		size:6,
	},
	favoureeName:{
		label:"Favouree name",
	},
	originalHeldBy:{
		label:"Original held by"
	}
}

InsuranceSchema = {
    insurer:{
        label:"Insurer",
        size:6
    },
    policyNumber:{
        label:"Policy number",
        size:6
    },
    sumInsured:{
        label:"Sum insured",
        size:6
    },
    expiry:{
        type:Date,
        label:"Expiry",
        size:6,
        input:"date",
    },
    documents:{
        type:[Object],
        label:"Insurance documents",
        input:DocAttachments.FileExplorer
    }
}

Parking = {  
    permanent:{
    	label:"Permanent",
    	size:6
    },
    temporary:{
    	label:"Temporary",
    	size:6
    },
}

LeaseSchema = {
    commencement: {
    	label:"Lease commencement",
    	size:6
    },
    expiry: {
    	label:"Lease expiry",
    	size:6
    },
    landlordExecuted: {
    	label:"Landlord executed",
    	input:"switch",
    	size:6
    },
    tenantExecuted: {
    	label:"Tenant executed",
    	input:"switch",
    	size:6
    },
    parking: {
    	label:"Parking",
    	schema:Parking,
    },
    insuranceDetails: {
    	label:"Insurance details",
    	schema:InsuranceSchema
    },
    securityDeposit: {
    	label:"Security deposit",
    	schema:SecurityDeposit
    }
}

FacilitySchema = {
    name: {
    	label: "Name",
    	defaultValue: "",
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
    address:{
    	label:"Address",
    	schema:AddressSchema,
    },
    operatingTimes:{
        label:"Operating times"
    },
    lease:{
    	schema:LeaseSchema,
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
    services: {
    	type:[Object],
    	label:"Building services",
    	defaultValue:function(){
        	return JSON.parse(JSON.stringify(Config.services));
    	}
    }
}