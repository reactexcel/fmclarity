/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import { Text, Phone, DateInput, Select, FileField } from '/modules/ui/MaterialInputs';

import { Facilities, FacilityListTile } from '/modules/models/Facilities';
import { Teams } from '/modules/models/Teams';
import { Users } from '/modules/models/Users';
/**
 * @memberOf 		module:models/Users
 */

var role = null;

const ManagerContactSchema = {
		name: {
			label: "Property manger's name",
			type: "string",
			input: Text,
			size: 6,
		},
		phone: {
			label: "Property manger\'s contact number",
			input: Phone,
			type: "phone",
			size: 6,
		},
		email: {
			label: 'Property manger\'s email address',
			type: 'string',
			input: Text,
		},
	}

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
			let user = Users.collection._transform({});
			user._id =  item._id;
			role = user.getRole();
			return role === "tenant" || role === "resident"
		},
	},
	status:{
		label: 'Status',
		input:Select,
		options: {
			items: ['Tenant', 'Owner'] ,
		},
		condition: ( item ) => {
			return role === "resident"
		}
	},
	facility: {
		label: "Site Address",
		type: "object",
		relation: {
			join: ( item ) => {
				if ( item.facility && item.facility._id ) {
					return Facilities.findOne( item.facility._id );
				}
			},
			unjoin: ( item ) => {
				if ( item.facility && item.facility._id ) {
					return _.pick( item.facility, '_id', 'name' );
				}
			}
		},
		input: Select,
		options: ( item ) => {
			let team = Session.getSelectedTeam(),
				facilities = team.getFacilities();
			return {
				items: facilities,
				view: FacilityListTile,
				afterChange: ( item ) => {
					if ( item == null ) {
						return;
					}
					item.level = null;
					item.apartment = null;
				},
			}
		},
		condition: ( item ) => {
			return role === "resident"
		}
	},
	level: {
		label: "Level",
		input: Select,
		size: 6,
		condition: ( item ) => {
			return role === "resident"
		},
		options: ( item ) => {
			return {
				items: item.facility ? item.facility.areas : null
			}
		}
	},
	apartment: {
		label: "Apartment",
		input: Select,
		size: 6,
		condition: ( item ) => {
			return role === "resident"
		},
		options: ( item ) => {
			return {
				items: item.level ? item.level.children : null
			}
		}
	},
	update:{
		label: 'Update',
		input:Select,
		options: {
			items: ['Complete', 'Incomplete'] ,
		},
		size:6,
		condition: ( item ) => {
			return role === "resident"
		}
	},
	file:{
		label: 'File',
		input: FileField,
		size:6,
		condition: ( item ) => {
			return role === "resident"
		}
	},
	contact_1:{
		label: 'Contact details',
		type: 'object',
		subschema: {
			name: {
				label: "Contact name",
				type: "string",
				size:6,
				input: Text,
			},
			phone: {
				label: "Contact number",
				type: "phone",
				size:6,
				input: Phone,
			},
			email: {
				label: 'Contact email address',
				type: 'string',
				input: Text,
			},
		},
		condition: ( item ) => {
			return role === "resident"
		},
	},

	contact_2:{
		label: 'Contact details ',
		type: 'object',
		subschema: {
			name: {
				label: "Contact name 2",
				type: "string",
				size:6,
				input: Text,
			},
			phone: {
				label: "Contact number 2",
				type: "phone",
				size:6,
				input: Phone,
			},
			email: {
				label: 'Contact email address 2',
				type: 'string',
				input: Text,
			},
		},
		condition: ( item ) => {
			return role === "resident"
		},
	},

	propertyManger: {
		label: "Property manager",
		input: Text,
		type: 'string',
		condition: ( item ) => {
			return role === "resident"
		}
	},

	propertyMangerContact: {
		label: "Property manager contact",
		type: 'object',
		subschema: ManagerContactSchema,
		condition: ( item ) => {
			return role === "resident"
		}
	},

	realEstateAgency:{
		label: 'Real estate agency',
		type: 'string',
		input: Text,
		condition: ( item ) => {
			return role === "resident"
		},
	},

	agentContact:{
		label:'Agent contact details',
		type: "object",
		subschema:{
			number:{
				label: 'Agent number',
				input: Phone,
				type: "phone",
				size: 6,
			},
			email:{
				label: 'Agent email address',
				input: Text,
				type: "string",
				size: 6,
			},
		},
		condition: ( item ) => {
			return role === "resident"
		}
	},

	leaseExpiry: {
		label: "Lease expiry",
		input: DateInput,
		type: "date",
		defaultValue: () => ( new Date() ),
		condition: ( item ) => {
			return role === "resident"
		}
	},
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
