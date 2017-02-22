import { Text, Select } from '/modules/ui/MaterialInputs';

export default BillingAddressSchema = {

	company: {
		input: Text,
		label: "Company",
		type: "string",
		required: true,
		size: 3
	},
	address_1: {
		input: Text,
		type: "string",
		label: "Address 1",
		required: true,
		size: 6
	},
	address_2: {
		input: Text,
		label: "Address 2",
		size: 6,
		type: "string",
	},
	suburb: {
		label: "Suburb",
		size: 3,
		input: Text,
		type: "string"
	},
	state: {
		input: Text,
		label: "State",
		type: "string",
		size: 3
	},
	postcode: {
		input: Text,
		label: "Postcode",
		type: "string",
		size: 3
	}
}
