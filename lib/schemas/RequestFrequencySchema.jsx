RequestFrequencySchema = {
	repeats:
	{
		label: "Repeats",
		description: "The number of times this item should happen",
		input: "mdtext",
		type: "number",
		defaultValue: 6,
		size: 6
	},
	number:
	{
		label: "Frequency (number)",
		description: "The number of days, weeks, months etc between repeats",
		input: "mdtext",
		type: "number",
		defaultValue: 6,
		size: 6
	},
	unit:
	{
		label: "Frequency (unit)",
		description: "The unit (days, weeks, months etc) of the repeats",
		input: "MDSelect",
		defaultValue: "months",
		type: "string",
		size: 6,
		options:
		{
			items: 
			[
				"days",
				"weeks",
				"months",
				"years",
			]
		}
	}
}
