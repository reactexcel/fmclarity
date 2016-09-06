import * as Input from 'meteor/fmc:material-inputs';

RequestFrequencySchema = {
	repeats: {
		label: "Repeats",
		description: "The number of times this item should happen",
		input: Input.Text,
		type: "number",
		defaultValue: 6,
		size: 6
	},
	number: {
		label: "Frequency (number)",
		description: "The number of days, weeks, months etc between repeats",
		input: Input.Text,
		type: "number",
		defaultValue: 6,
		size: 6
	},
	unit: {
		label: "Frequency (unit)",
		description: "The unit (days, weeks, months etc) of the repeats",
		input: Input.Select,
		defaultValue: "months",
		type: "string",
		size: 6,
		options: {
			items: [
				"days",
				"weeks",
				"months",
				"years",
			]
		}
	}
}
