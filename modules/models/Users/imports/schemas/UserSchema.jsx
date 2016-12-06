/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import { Text, Phone, DateInput, Select, FileField, Switch } from '/modules/ui/MaterialInputs';

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
		required: true,
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
		required: true,
		type: "string",
	},
	email: {
		label: "Email address",
		input: Text,
		required: true,
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
				//group = user.getSelectedFacility() || user.getSelectedTeam();

			return role === "tenant";
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
			let _id =  item._id || userId;
			user = Users.findOne( _id ),
			role = user.getRole();
		},
	},

	status:{
		label: "Tenant",
		type: "boolean",
		defaultValue: false,
		input: Switch,
		options: ( item ) => {
			return{
				afterChange: ( item ) => {
				}
			}
		},condition: ( item ) => {
			return role === "resident"
		},
	},

	resident:{
		label: 'Resident details',
		type: 'object',
		subschema: {
			name: {
				label: "Resident name",
				type: "string",
				size:6,
				input: Text,
			},
			mobile: {
				label: "Resident Mobile number",
				type: "phone",
				size:6,
				input: Phone,
			},
			landline: {
				label: "Resident landline number",
				type: "phone",
				size:6,
				input: Phone,
			},
			email: {
				label: 'Resident email address',
				type: 'string',
				size:6,
				input: Text,
			},
		},
		condition: ( item ) => {
			return role === "resident"
		},
	},

	hasSecondResident:{
		label: "Second resident contact details",
		type: "boolean",
		defaultValue: false,
		input: Switch,
		options: ( item ) => {
			return{
				afterChange: ( item ) => {
				}
			}
		},
		condition: ( item ) => {
			return role === "resident"
		},
	},

	secondResident:{
		label: 'Second resident details ',
		type: 'object',
		subschema: {
			name: {
				label: "Second resident name",
				type: "string",
				size:6,
				input: Text,
			},
			mobile: {
				label: "Second resident mobile number",
				type: "phone",
				size:6,
				input: Phone,
			},
			landline: {
				label: "Second resident landline number",
				type: "phone",
				size:6,
				input: Phone,
			},
			email: {
				label: 'Second resident email address',
					type: 'string',
					size:6,
					input: Text,
				},
			},
			condition: ( item ) => {
				return role === "resident" && item.hasSecondResident
			},
		},


		propertyManger:{
			label: "Property manager",
			optional: true,
			type: "object",
			input: Select,
			options: ( item ) => {
				let members = item.realEstateAgency ? item.realEstateAgency.members : [];
				members = _.uniq( members, false, ( i ) => {
						return i._id;
					} );
				let ids =  _.pluck( members, "_id" );
				members = Users.findAll( { _id: { $in: ids }, role: "property manager" });

				return {
					items: members,
					view: ContactCard,
					afterChange: ( item ) => {
						item.propertyMangerEmail = item.propertyManger.profile.email;
						currentState = item;
					},
					addNew:{
						show: Meteor.user().getRole() != 'staff',
						label: "Create New",
						onAddNewItem: ( callback ) => {
							let team = Teams.findOne( item.realEstateAgency._id ),
								group = item.facility;
							import { MemberActions } from '/modules/mixins/Members';
							MemberActions.create.run( group,
								 null,
								 ( newMember ) => callback( newMember ),
								 team );
						}
					},
				}
			},
			condition: ( item ) => {
				return role === "resident" && item.status;
			}
		},


		propertyMangerEmail: {
			label: 'Property manger\'s email address',
			type: 'string',
			input: ( props ) => (
				<div className="row">
					<div className="col-sm-8">
						<Text {...props} />
					</div>
					<div className="col-sm-4" style={{marginTop:"25px"}}>
						<a href="javascript:void(0);" style={ { fontSize:"14px", marginLeft:"35px" } }
							onClick={ ( e ) => {
								let facility = currentState.facility,
									email = currentState.propertyMangerEmail ,
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
										let team = Teams.findOne(currentState.realEstateAgency._id);
										team.sendMemberInvite( response.user );
										window.alert ( "Invitation has been sent to \"" + email + " \"" );
									} );
								}
							} }>
							<i className="fa fa-paper-plane-o" aria-hidden="true"> </i>
							 {" "}Invite PM
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
					//updatePropertyManager( item );
				}
			} )
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
						item.realEstateAgency = null;
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
						item.apartment = item.propertyManger  = item.realEstateAgency = null;
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
						item.propertyManger = item.realEstateAgency = null;
						currentState = item;
					}
				}
			}
		},


		realEstateAgency:{
			label: 'Real estate agency',
			type: 'object',
			optional: true,
			input: Select,
			relation: {
				join: ( item ) => {
					if ( item.realEstateAgency && item.realEstateAgency._id ) {
						return Teams.findOne( item.realEstateAgency._id );
					}
				},
				unjoin: ( item ) => {
					if ( item.realEstateAgency && item.realEstateAgency._id ) {
						return _.pick( item.realEstateAgency, '_id', 'name' );
					}
				}
			},
			input: Select,
			options: ( item ) => {
				let teams = Teams.findAll({ type: 'real estate'});
				return {
					items: teams,
					view: ContactCard,
					afterChange: ( item ) => {
						item.agentContact = null;
					},
					addNew:{
						show: Meteor.user().getRole() != 'staff',
						label: "Create New",
						onAddNewItem: ( callback ) => {
							import { Teams, TeamStepper } from '/modules/models/Teams';
							let team = Teams.create();
							Modal.show( {
								content: <TeamStepper item = { team } onFinish={ ( newItem ) => callback(newItem)} />
							} )
						}
					},
				}
			},
			condition: ( item ) => {
				return role === "resident" && item.status
			}
		},

		agentContact:{
			label:'Agent contact details',
			optional: true,
			type: "object",
			subschema:{
				name:{
					label: 'Agent name',
					type: 'string',
					input: Text,
					size: 6,
				},
				contact:{
					label: 'Agent contact number',
					type: 'phone',
					input: Phone,
					size: 6,
				},
				email:{
					label: 'Agent email address',
					type: 'string',
					input: Text,
				}
			},
			condition: ( item ) => {
				return role === "resident" && item.status;
			}
		},

		leaseExpiry: {
			label: "Lease expiry",
			input: DateInput,
			optional: true,
			size: 6,
			type: "date",
			defaultValue: () => ( new Date() ),
			condition: ( item ) => {
				return role === "resident"
			}
		},


		moveInDate: {
			label: "Move in date",
			input: DateInput,
			optional: true,
			size: 6,
			type: "date",
			defaultValue: () => ( new Date() ),
			condition: ( item ) => {
				return role === "resident"
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

		keys:{
			label: 'Second resident details ',
			type: 'object',
			subschema: {
				key_1: {
					label: "Key number 1",
					type: "string",
					size:6,
					input: Text,
				},
				key_2: {
					label: "Key number 2",
					type: "string",
					size:6,
					input: Text,
				},
			},
			condition: ( item ) => {
				return role === "resident"
			},
		},

		remoteNumbers:{
			label: 'Second resident details ',
			type: 'object',
			subschema: {
				remoteNumber_1: {
					label: "Remote number 1",
					type: "string",
					size:6,
					input: Text,
				},
				remoteNumber_2: {
					label: "Remote number 2",
					type: "string",
					size:6,
					input: Text,
				},
			},
			condition: ( item ) => {
				return role === "resident"
			},
		},

		vehicle:{
			label: 'Vehicle',
			type: 'object',
			subschema:{
				remoteNumber_1: {
					label: "Vehicle Description",
					type: "string",
					input: Text,
				},
				remoteNumber_2: {
					label: "Vehicle Rego",
					type: "string",
					input: Text,
				},
			},
			condition: ( item ) => {
				return role === "resident"
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
			level.children[i].propertyManger = item.propertyManger || {};
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
