/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { Text } from '/modules/ui/MaterialInputs';

/**
 * @memberOf 		module:models/Notifications
 */
const NotificationSchema = {
	actor: {
		type: "object",
		input: Text
	},
	action: {
		type: "object",
		input: Text
	},
	object: {
		type: "array",
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

/**
 * @memberOf 		module:models/Notifications
 */
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

export default NotificationSchema;