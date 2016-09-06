export default AddressSchema = {

	streetNumber: {
		label: "Number",
		size: 3
	},
	streetName: {
		label: "Street name",
		size: 6
	},
	streetType: {
		label: "Type",
		size: 3,
		input: "MDSelect",
		options: {
			items: [
				"Avenue",
				"Boulevard",
				"Court",
				"Crescent",
				"Drive",
				"Esplanade",
				"Lane",
				"Parade",
				"Place",
				"Road",
				"Square",
				"Street",
				"Terrace"
			]
		}
	},
	city: {
		label: "City",
		defaultValue: "",
		size: 6,
	},
	state: {
		label: "State",
		size: 3,
		input: "MDSelect",
		options: {
			items: [
				"ACT",
				"NSW",
				"SA",
				"TAS",
				"NT",
				"QLD",
				"VIC",
				"WA"
			]
		}
	},
	postcode: {
		label: "Postcode",
		size: 3
	}
}
