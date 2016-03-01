Insurance = {
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
		label:"Expiry",
		size:6
	},
	documents:{
		label:"Insurance documents",
		//input:"attachment",
	},
}

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
	documents:{
		label:"Lease documents",
		//input:"attachment",
	},
    parking: {
    	label:"Parking",
    	schema:Parking,
    },
    insuranceDetails: {
    	label:"Insurance details",
    	schema:Insurance
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
    	input:"attachments"
    },
    address:{
    	label:"Address",
    	schema:AddressSchema,
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
        relationship:{
            "hasMany":Users
        },
    },
    areas: {
    	type:[Object],
    	label:"Building areas",
    	input:"select",
    	defaultValue:function(){
        	return JSON.parse(JSON.stringify(Config.defaultAreas));
    	}
    },
    services: {
    	type:[Object],
    	label:"Building services",
    	input:"select",
    	defaultValue:function(){
        	return JSON.parse(JSON.stringify(Config.services));
    	}
    }
}