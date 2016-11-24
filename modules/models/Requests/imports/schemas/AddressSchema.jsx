import { Text, Select } from '/modules/ui/MaterialInputs';

export default AddressSchema = {

	streetNumber: {
		input: Text,
		label: "Number",
		type: "string",
		size: 3
	},
	streetName: {
		input: Text,
		type: "string",
		label: "Street name",
		size: 6
	},
	/*streetType: {
		label: "Type",
		size: 3,
		type: "string",
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
	},*/
	city: {
		input: Text,
		label: "City",
		size: 6,
		type: "string",
	},
	state: {
		label: "State",
		size: 3,
		input: Select,
		type: "string",
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
		type: "string",
		size: 3
	}
}
