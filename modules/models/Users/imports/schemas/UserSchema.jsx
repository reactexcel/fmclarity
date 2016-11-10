/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import { Text, Phone } from '/modules/ui/MaterialInputs';

/**
 * @memberOf 		module:models/Users
 */
const UserProfileSchema = {
	firstName: {
		label: "First name",
		type: "string",
		input: Text,
		size: 6,
		options: () => {
		}
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
		input: Phone,
		type: "phone",
	},
	phone2: {
		label: "Phone number 2",
		input: Phone,
		type: "phone",
	},
	tenancy: {
		label: "Tenancy",
		input: Text,
		type: "string",
		condition: ( item ) => {
			import { Users } from '/modules/models/Users';
			let user = Users.collection._transform({});
			user._id =  item._id;
			return user.getRole() === "tenant"
		}
	}
}

/**
 * @memberOf 		module:models/Users
 */
const UserSchema = {
	profile: {
		type: "object",
		subschema: UserProfileSchema,
		options: () => {
		},
	}
}

export default UserSchema;
