// move this to messages package

export default MessageSchema = {
	subject: {
		type: "string",
	},
	body: {
		type: "string",
	},
	recipient: {
		type: "object",
	},
	allRecipients: {
		type: "array",
		defaultValue: []
	},
	read: {
		type: "boolean",
		defaultValue: false
	},
	sticky: {
		type: "boolean",
		defaultValue: false
	},
	rating: {
		type: "number",
		input: "vote",
		label: "Rating"
	},
	commments: {
		type: "array",
		defaultValue: []
	},
	createdAt: {
		type: "date"
	}
}
