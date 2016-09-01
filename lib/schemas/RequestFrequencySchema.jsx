RequestFrequencySchema = {
	repeats:
	{
		input: "MDSelect",
		defaultValue: "6",
		size: 6,
		options:
		{
			items: [
				"1",
				"2",
				"3",
				"4",
				"5",
				"6"
			]
		}
	},
	number:
	{
		label: "Frequency (number)",
		input: "MDSelect",
		defaultValue: "6",
		size: 6,
		options:
		{
			items: [
				"1",
				"2",
				"3",
				"4",
				"5",
				"6"
			]
		}
	},
	unit:
	{
		label: "Frequency (unit)",
		input: "MDSelect",
		defaultValue: "months",
		size: 6,
		options:
		{
			items: [
				"days",
				"weeks",
				"months",
				"years",
			]
		}
	}
}
