/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import { Text } from '/modules/ui/MaterialInputs';

/**
 * @memberOf 		module:models/Users
 */
const UserProfileSchema = {
	firstName: {
		label: "First name",
		type: "string",
		input: Text,
		size: 6
	},
	lastName: {
		label: "Last name",
		type: "string",
		input: Text,
		size: 6
	},
	name: {
		label: "Display name",
		input: Text,
		type: "string",
	},
	email: {
		label: "Email address",
		input: Text,
		type: "string",
	},
	phone: {
		label: "Phone number",
		input: Text,
		type: "string",
	},
	phone2: {
		label: "Phone number 2",
		input: Text,
		type: "string",
	},
	tenancy: {
		label: "Tenancy",
		input: Text,
		type: "string",
	}
}

/**
 * @memberOf 		module:models/Users
 */
const UserSchema = {
	profile: {
		type: "object",
		subschema: UserProfileSchema
	}
}

export default UserSchema;
