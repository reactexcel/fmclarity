import './CloseDetailsSchema.jsx';
import './RequestLocationSchema.jsx';
import './RequestFrequencySchema.jsx';

import Facilities from '../collections/Facilities';
import { ContactCard } from 'meteor/fmc:doc-members';

IssueSchema = {

	//$schema: 				"http://json-schema.org/draft-04/schema#",
	//title:       			"Request",
	//description: 			"A work request",

	//properties: 
	//{
	name:
	{
		label: "Subject",
		description: "A brief, descriptive, title for the work request"
	},

	code:
	{
		label: "Code",
		description: "The unique code for this work request",
		type: "number",
		defaultValue: getJobCode,
	},

	type:
	{
		label: "Request type",
		description: "The work request type (ie Ad-hoc, Preventative)",
		type: "string",
		defaultValue: "Ad-hoc",
		input: "MDSelect",
		options:
		{
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

	priority:
	{
		label: "Priority",
		description: "The urgency of the requested work",
		type: "string",
		defaultValue: "Standard",
		condition: ( item ) =>
		{
			return item.type != "Preventative"
		},
		input: "MDSelect",
		size: 6,
		options:
		{
			items: [
				"Standard",
				"Scheduled",
				"Urgent",
				"Critical"
			]
		}
	},

	frequency:
	{
		/*label: "Frequency",
		description: "The frequency with which this job should occur",*/
		condition: "Preventative",
		schema: RequestFrequencySchema,
		optional: true,
	},

	status:
	{

		label: "Status",
		description: "The current status of the job",
		type: "string",
		defaultValue: "Draft",

		options:
		{
			items: [
				"Draft",
				"...and the others"
			]
		}
	},

	//////////////////////////////////////////////////
	// Facility dependant properties
	//////////////////////////////////////////////////
	level:
	{
		label: "Area",
		size: 4,
		type: "object",
		input: "MDSelect",
		options: ( item ) =>
		{
			return {
				items: item.facility ? item.facility.areas : null
			}
		}
	},

	area:
	{
		label: "Sub-area",
		size: 4,
		type: "object",
		input: "MDSelect",
		optional: true,
		options: ( item ) =>
		{
			return {
				items: item.level ? item.level.children : null
			}
		}
	},

	identifier:
	{
		label: "Identifier",
		description: "Area identifier for the job location (ie classroom number)",
		size: 4,
		type: "object",
		input: "MDSelect",
		optional: true,
		options: ( item ) =>
		{
			return {
				items: item.area ? item.area.children : null
			}
		}
	},

	//////////////////////////////////////////////////

	service:
	{
		label: "Service",
		description: "The category of work required",
		size: 6,
		type: "object",
		input: "MDSelect",
		options: ( item ) =>
		{
			return {
				items: item.facility ? item.facility.servicesRequired : null
			}
		}
	},

	subservice:
	{
		label: "Subservice",
		description: "The subcategory of work required",
		size: 6,
		type: "object",
		input: "MDSelect",
		optional: true,
		options: ( item ) =>
		{
			return {
				items: item.service ? item.service.children : null
			}
		}
	},

	//////////////////////////////////////////////////
	// Comments
	//////////////////////////////////////////////////
	description:
	{
		label: "Comments",
		description: "A detailed description of the work to be completed",
		type: "string",
		input: "mdtextarea",
		optional: true
	},

	acceptComment:
	{
		label: "Comment",
		description: "Comment about the acceptance of this work request",
		type: "string",
		input: "mdtextarea",
	},

	rejectComment:
	{
		label: "Reason for rejection",
		description: "The reason why this job was rejected",
		type: "string",
		input: "mdtextarea",
	},

	closeComment:
	{
		label: "Close comment",
		description: "Closing comments about this job",
		type: "string",
		input: "mdtextarea"
	},

	//////////////////////////////////////////////////
	// Quote related
	//////////////////////////////////////////////////
	quoteRequired:
	{
		label: "Quote required",
		description: "Is a quote required for this job?",
		type: "boolean",
		input: "switch"
	},

	quoteIsPreApproved:
	{
		label: "Auto approve quote?",
		info: "An auto approved quote will ",
		type: "boolean",
		input: "switch"
	},

	quote:
	{
		label: "Quote",
		description: "File detailing the estimated cost of this job",
		input: "FileField",
	},

	quoteValue:
	{
		label: "Value of quote",
		description: "The cost of the requested work",
		type: "number"
	},

	//////////////////////////////////////////////////
	// Settings
	//////////////////////////////////////////////////  		
	confirmRequired:
	{
		label: "Completion confirmation required",
		description: "Is manager confirmation required before the job can be closed?",
		input: "switch"
	},

	costThreshold:
	{
		label: "Value",
		size: 6,
		defaultValue: 500,
		condition: [ "Ad-hoc", "Contract" ],
	},

	closeDetails:
	{
		type: "object",
		schema: CloseDetailsSchema
	},

	//////////////////////////////////////////////////
	// Dates & timing
	//////////////////////////////////////////////////  		
	dueDate:
	{
		type: "date",
		label: "Due Date",
		description: "Latest date that the work can be completed",
		input: "MDDateTime",
		optional: true,
		size: 6,
		defaultValue: getDefaultDueDate
	},

	eta:
	{
		label: "ETA",
		optional: true,
		description: "Time the supplier is expected to attend the site",
		input: "MDDateTime",
	},

	//////////////////////////////////////////////////
	// Relations
	// Should be defined here in the schema and implemented automatically
	//////////////////////////////////////////////////

	// although I created a docowners package for this purpose I think I would prefer owner to be explicit
	// is there a better way?
	owner:
	{
		label: "Owner",
		description: "The creator or owner of this request",
		relation:
		{
			type: ORM.OneToOne,
			source: Users
		},
		input: "MDSelect",
	},

	team:
	{
		label: "Owning team",
		description: "The team who created this work request",
		relation:
		{
			type: ORM.OneToOne,
			source: Teams
		},
		input: "MDSelect",
	},

	facility:
	{
		label: "Facility",
		description: "The site for this job",
		relation:
		{
			type: ORM.OneToOne,
			source: Facilities
		},
		input: "MDSelect",

		options: ( item ) =>
		{
			return {
				items: ( item.team ? item.team.facilities : null ),
				view: ( Meteor.isClient ? FacilitySummary : null ),

				onChange: ( item ) =>
				{
					if( item == null) {
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

	supplier:
	{
		label: "Supplier",
		description: "The supplier who has been assigned to this job",
		relation:
		{
			type: ORM.HasOne,
			source: Teams
		},
		input: "MDSelect",
		options: ( item ) =>
		{
			return {
				items: ( item.facility ? item.facility.suppliers : null ),
				view: ( Meteor.isClient ? ContactCard : null )
			}
		},
	},

	assignee:
	{
		label: "Assignee",
		description: "The individual who has been allocated to this job",
		relation:
		{
			type: ORM.HasOne,
			source: Users
		},
		input: "MDSelect",
		options: ( item ) =>
		{
			return {
				items: ( item.supplier ? item.supplier.members : null ),
				view: ( Meteor.isClient ? ContactCard : null )
			}
		},
	},

	members:
	{
		label: "Contacts",
		description: "Stakeholders for this work request",
		/*relation:
		{
			type: ORM.ManyToMany,
			source: "users"
		},*/
		defaultValue: getMembersDefaultValue
	},

	attachments:
	{
		label: "Attachments",
		description: "Deprecated",
		/*relation:
		{
			type: ORM.ManyToMany,
			source: "Files"
		},
		*/
		input: DocAttachments.FileExplorer
	},

	documents:
	{
		label: "Documents",
		description: "All documents related to this job",
		/*relation:
		{
			type: ORM.ManyToMany,
			source: "Files"
		},*/
		input: DocAttachments.DocumentExplorer,
	},

	//////////////////////////////////////////////////  		
	//}
}

/*
 *
 *
 *
 */
function getMembersDefaultValue( item )
{
	console.log( item );

	let owner = Meteor.user(),
		team = Teams.findOne( item.team._id ),
		teamMembers = team.getMembers(
		{
			role: "portfolio manager"
		} );

	let members = [
	{
		_id: owner._id,
		name: owner.profile.name,
		role: "owner"
	} ];

	teamMembers.map( ( m ) =>
	{
		members.push(
		{
			_id: m._id,
			name: m.profile.name,
			role: "team manager"
		} )
	} );

	if ( item.facility )
	{
		let facility = Facilities.findOne( item.facility._id ),
			facilityMembers = facility.getMembers(
			{
				role: "manager"
			} );

		facilityMembers.map( ( m ) =>
		{
			members.push(
			{
				_id: m._id,
				name: m.profile.name,
				role: "facility manager"
			} )
		} );
	}

	return members;
}

function getTimeframe()
{
	let team = this.getTeam();
	if ( team )
	{
		return team.getTimeframe( this.priority );
	}
}

function getJobCode( item )
{
	let team = null,
		code = 0;

	if ( item && item.team )
	{
		team = Teams.findOne(
		{
			_id: item.team._id
		} );
		code = team.getNextWOCode();
	}

	return code;
}

function getDefaultDueDate( item )
{
	if ( !item.team )
	{
		return new Date();
	}
	let team = Teams.findOne( item.team._id ),
		timeframe = team.timeframes[ 'Standard' ] * 1000,
		now = new Date();

	return new Date( now.getTime() + timeframe );
}
