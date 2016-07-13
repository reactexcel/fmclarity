AddressSchema = {
	streetNumber:{
		label:"Number",
		size:3
	},
	streetName:{
		label: "Street name",
		size:6
	},
	streetType:{
		label: "Type",
		size:3
	},
	city:{
		label:"City",
    	defaultValue: "",
		size:6,
	},
	state:{
		label:"State",
		size:3,
	},
	postcode:{
		label:"Postcode",
		size:3
	}
}