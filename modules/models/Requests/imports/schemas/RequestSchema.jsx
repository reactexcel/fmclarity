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
		}
	},

	name: {
		label: "Subject",
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

	type: {
		label: "Request type",
		description: "The work request type (ie Ad-hoc, Preventative)",
		type: "string",
		defaultValue: "Ad-hoc",
		input: Select,
		options: {
			items: [
				"Ad-hoc",
				"Base Building",
				"Contract",
				"Defect",
				"Internal",
				"Preventative",
				"Template",
				"Warranty",
			]
		}
	},

	priority: {
		label: "Priority",
		description: "The urgency of the requested work",
		type: "string",
		defaultValue: "Standard",
		condition: ( item ) => {
			return item.type != "Preventative"
		},
		input: Select,
		size: 6,
		options: {
			items: [
				"Standard",
				"Scheduled",
				"Urgent",
				"Critical"
			]
		}
	},

	frequency: {
		/*label: "Frequency",
		description: "The frequency with which this job should occur",*/
		condition: "Preventative",
		subschema: RequestFrequencySchema,
		optional: true,
	},

	status: {

		label: "Status",
		description: "The current status of the job",
		type: "string",
		input: Select,
		readonly: true,
		defaultValue: "Draft",

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
		options: ( item ) => {
			return {
				items: item.facility ? item.facility.servicesRequired : null
			}
		}
	},

	subservice: {
		label: "Subservice",
		description: "The subcategory of work required",
		size: 6,
		type: "object",
		input: Select,
		optional: true,
		options: ( item ) => {
			return {
				items: item.service ? item.service.children : null
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
		defaultValue: 500,
		input: Text,
		condition: [ "Ad-hoc", "Contract" ],
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
		label: "Due Date",
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
		label: "Owning team",
		description: "The team who created this work request",
		relation: {
			join: ( item ) => {
				return Teams.findOne( item.team._id )
			},
			unjoin: ( item ) => {
				return _.pick( item.team, [ '_id', 'name' ] )
			}
		},
		input: Select,
		defaultValue: ( item ) => {
			return Session.getSelectedTeam();
		}
	},

	facility: {
		label: "Facility",
		description: "The site for this job",
		type: "object",
		relation: {
			join: ( item ) => {
				if( item.facility && item.facility._id ) {
					return Facilities.findOne( item.facility._id );
				}
			},
			unjoin: ( item ) => {
				if( item.facility && item.facility._id ) {
					return _.pick( item.facility, '_id', 'name' );
				}
			}
		},
		input: Select,

		options: ( item ) => {
			//console.log( item );
			return {
				items: ( item.team ? item.team.facilities : null ),
				view: ( Meteor.isClient ? FacilityListTile : null ),

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
			source: Teams
		},
		input: Select,
		options: ( item ) => {
			return {
				items: ( item.facility ? item.facility.suppliers : null ),
				view: ( Meteor.isClient ? ContactCard : null )
			}
		},
	},

	assignee: {
		label: "Assignee",
		description: "The individual who has been allocated to this job",
		relation: {
			join:( item ) => {
				if( item.assignee && item.assignee._id ) {
					import { Users } from '/modules/models/Users';
					return Users.findOne( item.assignee._id )
				}
			},
			unjoin:( item ) => {
				return {
					_id: item.assignee._id,
					name: item.assignee.profile.name
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
	}

	//////////////////////////////////////////////////  		
	//}
}

/*
 *
 *
 *
 */
function getMembersDefaultValue( item ) {
	console.log( item );

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

function getTimeframe() {
	let team = this.getTeam();
	if ( team ) {
		return team.getTimeframe( this.priority );
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

export default RequestSchema;