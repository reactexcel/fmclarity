AddressSchema = new ORM.Schema({
	streetNumber:{
		label:"Street number",
		size:3
	},
	streetName:{
		label: "Street name",
		size:6
	},
	streetType:{
		label: "Street name",
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
});