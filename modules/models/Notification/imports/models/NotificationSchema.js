// move this to messages package

export default NotificationSchema = {
	actor: {
		type: "object",
		input: UserSelector
	},
	verb: {
		type: "string",
		input: Text
	},
	object: {
		type: "object",
		subschema: NotificationObjectSchema
	},
	tags: {
		type: ["object"],
	},
	recipient: {
		type: "object",
	},
	read: {
		type: "boolean",
		defaultValue: false
	},
	sticky: {
		type: "boolean",
		defaultValue: false
	}
}

const NotificationObjectSchema = {
	type: {
		type: "string",
		input: Text
	},
	_id: {
		type: "string",
		input: Text
	}
}