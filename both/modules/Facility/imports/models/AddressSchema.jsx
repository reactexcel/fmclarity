import { Text, Select } from '/both/modules/MaterialInputs';

export default AddressSchema = {

	streetNumber: {
		input: Text,
		label: "Number",
		size: 3
	},
	streetName: {
		input: Text,
		label: "Street name",
		size: 6
	},
	streetType: {
		label: "Type",
		size: 3,
		input: Select,
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
		input: Text,
		label: "City",
		size: 6,
	},
	state: {
		label: "State",
		size: 3,
		input: Select,
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
		input: Text,
		label: "Postcode",
		size: 3
	}
}
