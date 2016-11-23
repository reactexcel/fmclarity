/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import { Text, Phone, DateInput, Select, FileField } from '/modules/ui/MaterialInputs';

import { Facilities, FacilityListTile } from '/modules/models/Facilities';
import { Teams } from '/modules/models/Teams';
import { Users } from '/modules/models/Users';

import { UserViewEdit } from '/modules/models/Users';
import { ContactCard } from '/modules/mixins/Members';
import React from "react";

/**
 * @memberOf 		module:models/Users
 */

var role = null,
	userId = null,
	currentState = null;

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
		optional: true,
		type: "phone",
	},
	phone2: {
		label: "Phone number 2",
		input: Phone,
		optional: true,
		type: "phone",
	},
	tenancy: {
		label: "Tenancy",
		input: Text,
		optional: true,
		type: "string",
		condition: ( item ) => {
			let user = Users.collection._transform({}),
				group = user.getSelectedFacility() || user.getSelectedTeam();
			user._id =  item._id || userId;
			role = user.getRole();
			return role === "tenant"
		},
	},
	status:{
		label: 'Status',
		input:Select,
		type:"string",
		optional: true,
		options: {
			items: ['Tenant', 'Owner'] ,
		},
		condition: ( item ) => {
			return role === "resident"
		}
	},
	facility: {
		label: "Site Address",
		optional: true,
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
					item.propertyManger = null;
					item.propertyMangerPhone = null;
					item.propertyMangerEmail = null;
					currentState = item;
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
		type: "object",
		optional: true,
		size: 6,
		condition: ( item ) => {import { ContactCard } from '/modules/mixins/Members';
			return role === "resident"
		},
		options: ( item ) => {
			return {
				items: item.facility ? item.facility.areas : null,
				afterChange: ( item ) => {
					item.apartment = item.propertyManger = item.propertyMangerPhone = item.propertyMangerEmail = null;
				}
			}
		}
	},
	apartment: {
		label: "Apartment",
		optional: true,
		type:"object",
		input: Select,
		size: 6,
		condition: ( item ) => {
			return role === "resident"
		},
		options: ( item ) => {
			return {
				items: item.level ? item.level.children : null,
				afterChange: ( item ) => {
					if ( item.apartment.propertyManger ) {
						let _id =  item.apartment.propertyManger._id,
							pm = Users.findOne( _id );
						item.propertyManger = pm.profile.firstName + " " + pm.profile.lastName;
						item.propertyMangerPhone = pm.profile.phone;
						item.propertyMangerEmail = pm.profile.email;
					} else {
						item.propertyManger = item.propertyMangerPhone = item.propertyMangerEmail = null;
					}
					currentState = item;
				}
			}
		}
	},
	/*update:{
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
		},*/

		propertyManger: {
			label: "Property manager",
			input: Text,
			type: 'object',
			optional: true,
			condition: ( item ) => {
				return role === "resident"
			},
		},



/*
propertyManger: {
	label: "Property manager",
	input: Select,
	type: 'object',
	optional: true,
	condition: ( item ) => {
		if ( item.apartment.propertyManger ) {
			let _id = item.apartment.propertyManger._id || "";
			item.apartment.propertyManger = Users.findOne( _id );
		}
		return role === "resident"
	},
	options: ( item ) => {
		return {
			view: ContactCard,
			addNew:{//Add new facility to current selectedTeam.
				show: !item.propertyManger && item.facility && item.apartment,
				label: "Add Property Manger",
				onAddNewItem: ( callback ) => {
					Modal.show( {
						content: <UserViewEdit team={Session.getSelectedTeam()} group={item.facility} addPersonnel={
							( pm ) => {
								callback( pm );
								item.propertyMangerPhone = pm.profile.phone;
								item.propertyMangerEmail = pm.profile.email;
								item.apartment.propertyManger = pm;
								let areas = item.facility.areas,
									level = item.level,
									apartment = item.apartment;
								for ( i in level.children || [] ) {
									if ( level.children[i].name === apartment.name ) {
										level.children[i].propertyManger = pm;
										break;
									}
								}
								for ( i in areas ) {
									if ( areas[i].name === level.name ) {
										areas[i] = level;
										break;
									}
								}
								item.facility.setAreas( areas );
							}
						}/>
					} )
				}
			},
		}
	},
},
*/
	propertyMangerPhone: {
		label: "Property manger\'s contact number",
		input: Phone,
		type: "phone",
		optional: true,
		condition: ( item ) => {
			return role === "resident"
		},
		options: (  ) => ( {
			afterChange: ( item ) => {
				updatePropertyManager( item );
			}
		} )
	},
	propertyMangerEmail: {
		label: 'Property manger\'s email address',
		type: 'string',
		input: ( props ) => (
			<div className="row">
				<div className="col-sm-8">
					<Text {...props} />
				</div>
				<div className="col-sm-4">
					<a href="#" style={ { fontSize:"10px" } }
						onClick={ ( e ) => {

							let facility = currentState.profile ? currentState.profile.facility : currentState.facility,
								email = currentState.profile ? currentState.profile.propertyMangerEmail : propertyMangerEmail ,
								regex = /.+@.+\..+/i;
							if ( !facility ){
								return;
							}

							facility = Facilities.findOne( facility._id );

							if ( !regex.test( email ) ) {
								alert( 'Please enter a valid email address' );
							} else {
								facility.invitePropertyManager( email, {
									role: "property manger"
								}, function ( response ){
									Session.getSelectedTeam().sendMemberInvite( response.user );
									window.alert ( "Invitation has been sent to \"" + email + " \"" );
								} );

							}

						} }>
						<i className="fa fa-envelope" aria-hidden="true"> </i>
						 Invite Property Manager
					</a>
				</div>
			</div>
		),
		optional: true,
		condition: ( item ) => {
			return role === "resident"
		},
		options: (  ) => ( {
			afterChange: ( item ) => {
				updatePropertyManager( item );
			}
		} )
	},

	realEstateAgency:{
		label: 'Real estate agency',
		type: 'string',
		optional: true,
		input: Text,
		condition: ( item ) => {
			return role === "resident"
		},
	},

	agentContact:{
		label:'Agent contact details',
		optional: true,
		type: "object",
		subschema:{
			number:{
				label: 'Agent number',
				input: Phone,
				type: "phone",
				size: 6,
			},
			/*email:{
				label: 'Agent email address',
				input: Text,
				type: "string",
				size: 6,
			},*/
		},
		condition: ( item ) => {
			return role === "resident"
		}
	},

	leaseExpiry: {
		label: "Lease expiry",
		input: DateInput,
		optional: true,
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
		options: ( item ) => {
			//get Id of selected user from list or new user
			userId = item._id;
			currentState = item;
		},
	}
}

function updatePropertyManager( item ) {

	let areas = item.facility.areas,
		level = item.level,
		apartment = item.apartment;
		currentState = item;
	for ( i in level.children || [] ) {
		if ( level.children[i].name === apartment.name ) {
			level.children[i].propertyManger = {
				name: item.propertyManger || "",
				email: item.propertyMangerEmail || "",
			};
			break;
		}
	}
	for ( i in areas ) {
		if ( areas[i].name === level.name ) {
			areas[i] = level;
			break;
		}
	}
	item.facility.setAreas( areas );

}

export default UserSchema;
