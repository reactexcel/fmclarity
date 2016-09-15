export default EmailSchema = {
	to: {
		type: ["email"],
		input: EmailRecipientInput
	},
	cc: {
		type: ["email"],
		input: EmailRecipientInput
	},
	bcc: {
		type: ["email"],
		input: EmailRecipientInput
	},
	from: {
		type: "email",
		input: Text
	},
	subject: {
		type: "string",
		input: Text
	},
	body: {
		type: "string",
		input: TextArea
	}
}