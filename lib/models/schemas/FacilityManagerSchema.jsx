FacilityManagerSchema = {
	type:{
		label:"Type",
	},
	companyName : {
		label:"Company name",
		size:6,
	},
	abn:{
		label:"ABN",
		size:6
	},
	contactName: {
		label:"Contact name",
	},
	phone:{
		label:"Phone",
		size:6
	},
	email:{
		label:"Email",
		size:6
	},
	address:{
		label:"Address",
		schema:AddressSchema,
	},
}