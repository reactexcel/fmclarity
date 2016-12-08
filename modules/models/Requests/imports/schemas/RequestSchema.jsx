/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import CloseDetailsSchema from './CloseDetailsSchema.jsx';
import RequestLocationSchema from './RequestLocationSchema.jsx';
import RequestFrequencySchema from './RequestFrequencySchema.jsx';

import { Teams } from '/modules/models/Teams';
import { Requests } from '/modules/models/Requests';
import { DocExplorer } from '/modules/models/Documents';
import { FileExplorer } from '/modules/models/Files';
import { Facilities, FacilityListTile } from '/modules/models/Facilities';

import { ContactCard } from '/modules/mixins/Members';
import { Text, TextArea, Select, DateTime, Switch, DateInput, FileField, Currency } from '/modules/ui/MaterialInputs';

import AddressSchema from './AddressSchema.jsx'

import React from "react";

/**
 * @memberOf 		module:models/Requests
 */
const RequestSchema = {

	//$schema: 				"http://json-schema.org/draft-04/schema#",
	//title:       			"Request",
	//description: 			"A work request",

	//properties:
	//{
	_id: {
		label: "Auto generated document id",
		description: "Document id generated by Mongo",
		type: "string",
		input: Text,
		options: {
			readonly: true
		},
		defaultValue: () => {
			return Random.id();
		}
	},

	name: {
		label: "Requested Work",
		type: "string",
		required: true,
		input: Text,
		description: "A brief, descriptive, title for the work request"
	},

	code: {
		label: "Code",
		description: "The unique code for this work request",
		type: "number",
		input: Text,
		defaultValue: getJobCode,
		options: {
			readonly: true
		}
	},

	address: {
		label: "Address",
		description: "The location of the site",
		type: "object",
		subschema: AddressSchema,
	},

	type: {
		label: "Request type",
		description: "The work request type (ie Ad-hoc, Preventative)",
		type: "string",
		required: true,
		defaultValue: () => {
			let team = Session.get( 'selectedTeam' ),
				teamType = null;
			if ( team ) {
				teamType = team.type;
			}
			if ( teamType == 'contractor' ) {
				return 'Tenancy';
			}
			return "Ad-hoc";
		},
		input: Select,
		options: () => {
			let role = Meteor.user().getRole();
			return{
				items: role !== "staff" ? [
					"Ad-hoc",
					"Booking",
					//"Internal",
					"Preventative",
					"Tenancy",
					//"Base Building",
					//"Contract",
					"Defect",
					//"Template",
					//"Warranty",
				] : [ "Ad-hoc", "Booking", "Tenancy", ]
			}

		}
	},

	priority: {
		label: "Priority",
		description: "The urgency of the requested work",
		type: "string",
		defaultValue: "Standard",
		required: true,
		condition: ( request ) => {
			if ( request.type == "Preventative" || request.type == 'Booking' ) {
				return false;
			}
			return true;
		},
		input: Select,
		size: 6,
		options: ( item ) => {
			return ( {
				items: [
					"Standard",
					"Scheduled",
					"Urgent",
					"Critical"
				],
				afterChange: ( item ) => {
					let timeframe, dueDate;
					if ( item.team && item.priority ) {
						timeframe = getTimeframe( item.team._id, item.priority );
						timeframe *= 1000;
						dueDate = ( ( ( new Date() ).getTime() ) + timeframe );
						item.dueDate = new Date( dueDate );
					}
				}
			} )
		}
	},

	frequency: {
		/*label: "Frequency",
		description: "The frequency with which this job should occur",*/
		condition: "Preventative",
		subschema: RequestFrequencySchema,
		required: true,
		type: "object",
	},

	duration: {
		label: "Duration",
		type: "string",
		input: Text,
		size: 6,
		required: true,
		condition: "Booking"
	},

	status: {

		label: "Status",
		description: "The current status of the job",
		type: "string",
		input: Select,
		readonly: true,
		defaultValue: "Draft",/*() => {
			let role = Meteor.apply( 'User.getRole', [], { returnStubValue: true } );
			return _.indexOf( [ "portfolio manager", "manager" ], role ) > -1 ? "New" : "Draft";
		},*/

		options: {
			items: [
				'Draft',
				'New',
				'Approved',
				'Accepted',
				'Quoting',
				'Complete',
				'Closed'
			]
		}
	},

	//////////////////////////////////////////////////
	// Facility dependant properties
	//////////////////////////////////////////////////

	level: {
		label: "Area",
		size: 4,
		type: "object",
		input: Select,
		required: true,
		condition: ( item ) => {
			let selectedTeam = Session.get( 'selectedTeam' ),
				teamType = null;
			if ( selectedTeam ) {
				teamType = selectedTeam.type;
			}
			return teamType == 'fm' || !_.isEmpty( item.level );
		},
		options: ( item ) => {
			return {
				items: item.facility ? item.facility.areas : null
			}
		}
	},

	area: {
		label: "Sub-area",
		size: 4,
		type: "object",
		input: Select,
		condition: ( item ) => {
			let selectedTeam = Session.get( 'selectedTeam' ),
				teamType = null;
			if ( selectedTeam ) {
				teamType = selectedTeam.type;
			}
			return teamType == 'fm' || !_.isEmpty( item.area );
		},
		options: ( item ) => {
			return {
				items: item.level ? item.level.children : null
			}
		}
	},

	identifier: {
		label: "Identifier",
		description: "Area identifier for the job location (ie classroom number)",
		size: 4,
		type: "object",
		input: Select,
		condition: ( item ) => {
			let selectedTeam = Session.get( 'selectedTeam' ),
				teamType = null;
			if ( selectedTeam ) {
				teamType = selectedTeam.type;
			}
			return teamType == 'fm' || !_.isEmpty( item.identifier );
		},
		options: ( item ) => {
			return {
				items: item.area ? item.area.children : null
			}
		}
	},

	//////////////////////////////////////////////////

	service: {
		label: "Service",
		description: "The category of work required",
		size: 6,
		type: "object",
		input: Select,
		required: true,
		condition: ( request ) => {
			let team = Session.getSelectedTeam(),
				teamType = null,
				services = [];
			if ( team ) {
				teamType = team.type;
				if ( team.getAvailableServices ) {
					services = team.getAvailableServices()
				}
			}
			if ( request.type == 'Booking' ) {
				return false;
			} else if ( teamType == 'contractor' && !team.services.length <= 1 ) {
				return false;
			}
			return true;
		},
		options: ( item ) => {
			let selectedTeam = Session.getSelectedTeam(),
				teamType = null,
				items = null;
			if ( selectedTeam ) {
				teamType = selectedTeam.type;
			}

			if ( teamType == 'fm' && item.facility ) {
				items = item.facility.servicesRequired;
			} else if ( teamType == 'contractor' && team.getAvailableServices ) {
				items = team.getAvailableServices();
			}


			return {
				items: items,
				afterChange: ( item ) => {
					if ( item == null || teamType == 'contractor' ) {
						return;
					}
					if ( item.service.data ) {
						let supplier = item.service.data.supplier;
						let defaultSupplier;
						if ( supplier ) {
							if ( supplier._id ) {
								defaultSupplier = Teams.findOne( item.service.data.supplier._id );
								if ( !defaultSupplier && supplier.name ) {
									defaultSupplier = Teams.findOne( { name: item.service.data.supplier.name } );
								}
							} else if ( supplier.name ) {
								defaultSupplier = Teams.findOne( { name: item.service.data.supplier.name } );
							}
							item.supplier = defaultSupplier;
						} else {
							item.supplier = null;
							item.subservice = null;
						}
					}
				}
			}
		}
	},

	subservice: {
		label: "Subservice",
		description: "The subcategory of work required",
		size: 6,
		type: "object",
		input: Select,
		condition: ( request ) => {
			let team = Session.getSelectedTeam(),
				teamType = null,
				services = [];
			if ( team ) {
				teamType = team.type;

				if ( team.getAvailableServices ) {
					services = team.getAvailableServices()
				}
			}
			if ( request.type == 'Booking' ) {
				return false;
			} else if ( teamType == 'contractor' && !team.services.length <= 1 ) {
				return false;
			}
			return true;
		},
		options: ( item ) => {
			return {
				items: item.service ? item.service.children : null,
				afterChange: ( item ) => {
					if ( item == null ) {
						return;
					}
					if ( item.subservice.data ) {
						let supplier = item.subservice.data.supplier;
						let defaultSupplier;
						if ( supplier ) {
							if ( supplier._id ) {
								defaultSupplier = Teams.findOne( item.subservice.data.supplier._id );
								if ( !defaultSupplier && supplier.name ) {
									defaultSupplier = Teams.findOne( { name: item.subservice.data.supplier.name } );
								}
							} else if ( supplier.name ) {
								defaultSupplier = Teams.findOne( { name: item.subservice.data.supplier.name } );
							}
							item.supplier = defaultSupplier;
						} else {
							item.supplier = null;
						}
					}
				}
			}
		}
	},

	//////////////////////////////////////////////////
	// Comments
	//////////////////////////////////////////////////

	description: {
		label: "Comments",
		description: "A detailed description of the work to be completed",
		type: "string",
		input: TextArea,
	},

	issueComment: {
		label: "Comment",
		description: "Comment about the issuing of this work request",
		type: "string",
		input: TextArea,
		required: true,
	},

	acceptComment: {
		label: "Comment",
		description: "Comment about the acceptance of this work request",
		type: "string",
		input: TextArea,
		required: true,
	},

	rejectComment: {
		label: "Reason for rejection",
		description: "The reason why this job was rejected",
		type: "string",
		input: TextArea,
		required: true,
	},

	closeComment: {
		label: "Close comment",
		description: "Closing comments about this job",
		type: "string",
		input: TextArea,
		required: true,
	},

	reverseComment: {
		label: "Comment",
		description: "Reason for reversal",
		type: "string",
		input: TextArea,
		required: true,
	},

	reopenComment: {
		label: "Comment",
		description: "Reason for reopening",
		type: "string",
		input: TextArea,
		required: true,
	},

	//////////////////////////////////////////////////
	// Quote related
	//////////////////////////////////////////////////

	quoteRequired: {
		label: "Quote required",
		description: "Is a quote required for this job?",
		type: "boolean",
		input: Switch
	},

	quoteIsPreApproved: {
		label: "Auto approve quote?",
		info: "An auto approved quote will ",
		type: "boolean",
		input: Switch
	},

	quote: {
		label: "Quote",
		description: "File detailing the estimated cost of this job",
		input: FileField,
	},

	quoteValue: {
		label: "Value of quote",
		description: "The cost of the requested work",
		type: "number"
	},

	//////////////////////////////////////////////////
	// Settings
	//////////////////////////////////////////////////

	confirmRequired: {
		label: "Completion confirmation required",
		description: "Is manager confirmation required before the job can be closed?",
		input: Switch
	},

	costThreshold: {
		label: "Value",
		type: "number",
		size: 6,
		defaultValue: '500',
		input: Currency,
		condition: ( request ) => {
			if( _.contains( [ "Ad-hoc", "Contract", "Tenancy" ], request.type )  ) {
				return false;
			}
			let role = Meteor.user().getRole();
			if( role == 'staff' ) {
				return false;
			}
			return true;
		}
	},

	closeDetails: {
		type: "object",
		subschema: CloseDetailsSchema
	},

	//////////////////////////////////////////////////
	// Dates & timing
	//////////////////////////////////////////////////

	dueDate: {
		type: "date",
		label: "Due/Start Date",
		description: "Latest date that the work can be completed",
		input: DateTime,
		size: 6,
		required: true,
		defaultValue: getDefaultDueDate,
		condition: ( request ) => {
			let role = Meteor.user().getRole();
			if( role == 'staff' ) {
				return false;
			}
			return true;
		}
	},

	issuedAt: {
		type: "date",
		label: "Issued date",
		description: "Date and time that the job was issued",
		input: DateTime,
		size: 6,
		required: true,
		defaultValue: ""
	},

	eta: {
		label: "ETA",
		description: "Time the supplier is expected to attend the site",
		size: 6,
		required: true,
		input: DateTime
	},

	//////////////////////////////////////////////////
	// Relations
	// Should be defined here in the schema and implemented automatically
	//////////////////////////////////////////////////

	team: {
		label: "Client",
		description: "The team who created this work request",
		type: "object",
		relation: {
			join: ( item ) => {
				return Teams.findOne( item.team._id )
			},
			unjoin: ( item ) => {
				if ( item.team ) {
					return _.pick( item.team, [ '_id', 'name' ] )
				}
			}
		},
		input: Select,
		options: ( item ) => {
			let team = Session.getSelectedTeam(),
				teamType = null;
			if ( team ) {
				teamType = team.type;
			}
			return {
				items: teamType == 'contractor' ? team.getClients() : null,
				view: ContactCard
			}
		},
		defaultValue: ( item ) => {
			let team = Session.getSelectedTeam(),
				teamType = null;
			if ( team ) {
				teamType = team.type;
			}
			if ( teamType == 'contractor' ) {
				return null;
			}
			return team;
		}
	},

	facility: {
		label: "Site Address",
		description: "The site for this job",
		type: "object",
		required: true,
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

		options: ( request ) => {

			let team = Teams.findOne( request.team._id ),
				facilities = team.getFacilities( { 'team._id': request.team._id } );
			/*
			import { Facilities } from '/modules/models/Facilities';
			let facilities = Facilities.findAll( { 'team._id': request.team._id } );
			*/
			return {
				items: facilities,
				view: FacilityListTile,

				afterChange: ( request ) => {
					if ( request == null ) {
						return;
					}
					request.level = null;
					request.area = null;
					request.identifier = null;
					request.service = null;
					request.subservice = null;
					request.supplier = null;
					request.members = getMembersDefaultValue( request );
				},
				addNew:{
					//Add new facility to current selectedTeam.
					show: Meteor.user().getRole() != 'staff',
					label: "Create New",
					onAddNewItem: ( callback ) => {
						import { Facilities, FacilityStepperContainer } from '/modules/models/Facilities';
						let team = Session.getSelectedTeam(),
						    facility = Facilities.collection._transform( { team } );
						Modal.show( {
							content:
								<FacilityStepperContainer params = { {
									item: facility,
									onSaveFacility:
										( facility ) => {
											callback( facility );
										}
								} } />
						} )
					}
				},
			}
		},
	},

	supplier: {
		label: "Supplier",
		description: "The supplier who has been assigned to this job",
		type: "object",
		relation: {
			type: ORM.HasOne,
			source: Teams,
		},
		condition: ( request ) => {
			let selectedTeam = Session.get( 'selectedTeam' );
			teamType = null;
			if ( selectedTeam ) {
				teamType = selectedTeam.type;
			}
			return (request.type != 'Booking' && teamType != 'contractor') ? ( Meteor.user().getRole() != "staff" ) : false;
		},
		defaultValue: ( item ) => {
			let team = Session.getSelectedTeam(),
				teamType = null;
			if ( team ) {
				teamType = team.type;
			}
			if ( teamType == 'fm' ) {
				return null;
			}
			return team;
		},
		input: Select,
		options: ( item ) => {
			let facility = item.facility,
				supplier = null;
			return {
				items: item.facility && item.facility.getSuppliers ? item.facility.getSuppliers() : null,
				view: ContactCard,
				addNew: {
					//Add new supplier to request and selected facility.
					show: Meteor.user().getRole() != 'staff',
					label: "Create New",
					onAddNewItem: ( callback ) => {
						import { TeamStepper } from '/modules/models/Teams';
						Modal.show( {
							content: <TeamStepper item = {supplier} facility={facility} onChange = {
								( supplier ) => {
									facility.addSupplier( supplier );
									callback( supplier );
								}
							}/>
						} )
					}
				},
				afterChange: ( ) => {

				}
			}
		},
	},

	assignee: {
		label: "Assignee",
		description: "The individual who has been allocated to this job",
		relation: {
			join: ( item ) => {
				if ( item.assignee && item.assignee._id ) {
					import { Users } from '/modules/models/Users';
					return Users.findOne( item.assignee._id )
				}
			},
			unjoin: ( item ) => {
				if ( item.assignee && item.assignee.profile ) {
					return {
						_id: item.assignee._id,
						name: item.assignee.profile.name
					}
				}
			}
		},
		condition: ( request ) => {
			if( request.type == 'Preventative' ) {
				return false;
			}
			let team = Session.getSelectedTeam();
			if( request.supplier && ( team._id == request.supplier._id || team.name == request.supplier.name ) ) {
				return true;
			}
		},
		input: Select,
		options: ( request ) => {
			request = Requests.collection._transform( request );
			let supplier = request.getSupplier(),
				members = Teams.getMembers( supplier );
			return {
				items: members,
				view: ContactCard,
				addNew:{
					//Add new facility to current selectedTeam.
					show: Meteor.user().getRole() != 'staff',
					label: "Add New",
					onAddNewItem: ( callback ) => {
						import { Users, UserViewEdit } from '/modules/models/Users';
						let team = Session.getSelectedTeam();
						Modal.show( {
							content:
								<UserViewEdit group={ team } team={ team } addPersonnel={ ( newAssignee ) => callback( newAssignee ) }/>
						} )
					}
				},
				afterChange: ( item ) => {
					console.log( item.assignee );
					let found = false;
					if( item.assignee ) {
						import { Users } from '/modules/models/Users';
						let assignee = Users.findOne( item.assignee._id );
						for( i in item.members ){
							let member = item.members[i];
							if ( member.role == "assignee" ){
								item.members[i] = {
									_id: assignee._id,
									name: assignee.profile.name,
									role: "assignee"
								};
								found = true;
								break;
							}
						}
						if (!found){
							item.members.push( {
								_id: assignee._id,
								name: assignee.profile.name,
								role: "assignee"
							} );
						}
					}
				}
			}
		},
	},

	members: {
		label: "Contacts",
		description: "Stakeholders for this work request",
		defaultValue: getMembersDefaultValue
	},

	documents: {
		label: "Documents",
		description: "Saved request documents",
		type: "array",
		/*relation:
		{
		    type: ORM.HasMembers,
		    source: "Files",
		    key: "team._id"
		},*/
		input: DocExplorer
	},

	attachments: {
		label: "Attachments",
		type: "array",
		defaultValue: [],
		input: FileExplorer
	},

	//////////////////////////////////////////////////
	//}

	requireServiceReport: {
		label: "Require Service Report",
		type: "boolean",
		defaultValue: false,
		input: Switch,
		condition:() => {
			let role = Meteor.user().getRole();
			return _.indexOf(["manager", "portfolio manager", "team portfolio manager", "team manager"], role) > -1 ;
		}
	},

	requireInvoice: {
		label: "Require Invoice",
		type: "boolean",
		defaultValue: false,
		input: Switch,
		condition:() => {
			let role = Meteor.user().getRole();
			return _.indexOf(["manager", "portfolio manager", "team portfolio manager", "team manager"], role) > -1 ;
		}
	},



}

/*
 *
 *
 *
 */
function getMembersDefaultValue( item ) {

	if ( item.team == null ) {
		return;
	}

	let owner = Meteor.user(),
		team = Teams.findOne( item.team._id ),
		teamMembers = team.getMembers( {
			role: "portfolio manager"
		} );

	let members = [ {
		_id: owner._id,
		name: owner.profile.name,
		role: "owner"
	} ];

	teamMembers.map( ( m ) => {
		members.push( {
			_id: m._id,
			name: m.profile.name,
			role: "team manager"
		} )
	} );

	if ( item.facility ) {
		let facility = Facilities.findOne( item.facility._id ),
			facilityMembers = facility.getMembers( {
				role: "manager"
			} );

		facilityMembers.map( ( m ) => {
			members.push( {
				_id: m._id,
				name: m.profile.name,
				role: "facility manager"
			} )
		} );
	}

	return members;
}

function getTimeframe( _id, priority ) {
	//let team = this.getTeam();
	let team = Teams.findOne( { _id: _id } );
	if ( team ) {
		return team.getTimeframe( priority );
	}
}

function getJobCode( item ) {
	let team = null,
		code = 0;

	if ( item && item.team ) {
		team = Teams.findOne( {
			_id: item.team._id
		} );
		code = team.getNextWOCode();
	}

	return code;
}

function getDefaultDueDate( item ) {
	if ( !item.team ) {
		return new Date();
	}
	let team = Teams.findOne( item.team._id ),
		timeframe = team.timeframes[ 'Standard' ] * 1000,
		now = new Date();

	return new Date( now.getTime() + timeframe );
}

function getRole() {
	return RBAC.getRole( Meteor.user(), Session.getSelectedTeam() );
}

export default RequestSchema;
