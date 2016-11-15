/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import CloseDetailsSchema from './CloseDetailsSchema.jsx';
import RequestLocationSchema from './RequestLocationSchema.jsx';
import RequestFrequencySchema from './RequestFrequencySchema.jsx';

import { Teams } from '/modules/models/Teams';
import { DocExplorer } from '/modules/models/Documents';
import { FileExplorer } from '/modules/models/Files';
import { Facilities, FacilityListTile } from '/modules/models/Facilities';

import { ContactCard } from '/modules/mixins/Members';
import { Text, TextArea, Select, DateTime, Switch, DateInput, FileField } from '/modules/ui/MaterialInputs';

import AddressSchema from './AddressSchema.jsx'


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
		defaultValue:()=>{
			return Random.id();
		}
	},

	name: {
		label: "Requested Work",
		type: "string",
		input: Text,
		description: "A brief, descriptive, title for the work request"
	},

	code: {
		label: "Code",
		description: "The unique code for this work request",
		type: "number",
		input: Text,
		//defaultValue: getJobCode,
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
//		defaultValue: "Ad-hoc",
		input: Select,
		options: {
			items: [
				"Ad-hoc",
				"Booking",
				//"Internal",
				"Preventative",
				//"Base Building",
				//"Contract",
				//"Defect",
				//"Template",
				//"Warranty",
			]
		}
	},

	priority: {
		label: "Priority",
		description: "The urgency of the requested work",
		type: "string",
		defaultValue: "Standard",
		condition: ( request ) => {
			return request.type != "Preventative" && request.type != 'Booking'
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
		optional: true,
	},

	duration: {
		label: "Duration",
		type: "string",
		input: Text,
		size: 6,
		condition: "Booking"
	},

	status: {

		label: "Status",
		description: "The current status of the job",
		type: "string",
		input: Select,
		readonly: true,
		defaultValue: () => {
			let role = Meteor.apply( 'User.getRole', [], { returnStubValue: true } );
			return _.indexOf( [ "portfolio manager", "manager" ], role ) > -1 ? "New" : "Draft";
		 },

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
		optional: true,
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
		optional: true,
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
		condition: ( request ) => {
			return request.type!='Booking'
		},
		options: ( item ) => {
			return {
				items: item.facility ? item.facility.servicesRequired : null,
				afterChange: ( item ) => {
					if ( item == null ) {
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
			return request.type!='Booking'
		},
		optional: true,
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
		optional: true
	},

	issueComment: {
		label: "Comment",
		description: "Comment about the issuing of this work request",
		type: "string",
		input: TextArea,
	},

	acceptComment: {
		label: "Comment",
		description: "Comment about the acceptance of this work request",
		type: "string",
		input: TextArea,
	},

	rejectComment: {
		label: "Reason for rejection",
		description: "The reason why this job was rejected",
		type: "string",
		input: TextArea,
	},

	closeComment: {
		label: "Close comment",
		description: "Closing comments about this job",
		type: "string",
		input: TextArea
	},

	reverseComment: {
		label: "Comment",
		description: "Reason for reversal",
		type: "string",
		input: TextArea
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
		size: 12,
		defaultValue: '$500',
		optional: true,
		input: Text,
		condition: [ "Ad-hoc", "Contract" ],
		options: ( ) => {
			return {
				afterChange: ( item ) => {
					if ( _.indexOf( item.costThreshold, '$' ) !== 0 ){
						item.costThreshold = '$' + item.costThreshold;
					}
				}
			}
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
		defaultValue: getDefaultDueDate
	},

	issuedAt: {
		type: "date",
		label: "Issued date",
		description: "Date and time that the job was issued",
		input: DateTime,
		size: 6,
	},

	eta: {
		label: "ETA",
		description: "Time the supplier is expected to attend the site",
		size: 6,
		input: DateTime,
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
		options: ( ) => {
				return {

				}
		},
		defaultValue: ( item ) => {
			let role = getRole( );
			return role == 'supplier manager' ? null : Session.getSelectedTeam( );
		}
	},

	facility: {
		label: "Facility",
		description: "The site for this job",
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
			//let team = Session.getSelectedTeam();
			return {
				items: ( item.team ? item.team.getFacilities() : null ),
				view: FacilityListTile,

				afterChange: ( item ) => {
					if ( item == null ) {
						return;
					}
					item.level = null;
					item.area = null;
					item.identifier = null;
					item.service = null;
					item.subservice = null;
					item.supplier = null;
				}
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
			return request.type!='Booking'
		},
		input: Select,
		options: ( item ) => {
			//console.log( item );
			return {
				items: item.facility && item.facility.getSuppliers ? item.facility.getSuppliers() : null,
				view: ContactCard
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
		input: Select,
		options: ( item ) => {
			return {
				items: ( item.supplier ? item.supplier.members : null ),
				view: ( Meteor.isClient ? ContactCard : null )
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


	//////////////////////////////////////////////////
	//}
}

/*
 *
 *
 *
 */
function getMembersDefaultValue( item ) {
	//console.log( item );

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

function getRole () {
	return RBAC.getRole( Meteor.user(), Session.getSelectedTeam() );
}

export default RequestSchema;
