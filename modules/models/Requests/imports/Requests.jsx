/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { Model } from '/modules/core/ORM';

import RequestSchema from './schemas/RequestSchema.jsx';

import { Owners } from '/modules/mixins/Owners';
import { Roles } from '/modules/mixins/Roles';
import { Members } from '/modules/mixins/Members';
import { DocMessages } from '/modules/models/Messages';

import { Documents } from '/modules/models/Documents';
import { LoginService } from '/modules/core/Authentication';

import { Teams } from '/modules/models/Teams';
import { SupplierRequestEmailView } from '/modules/core/Email';
import { OverdueWorkOrderEmailView } from '/modules/core/Email';

import moment from 'moment';


if ( Meteor.isServer ) {
	Meteor.publish( 'Requests', () => {
		return Requests.find();
	} );

	Meteor.publish( 'Requests: Closed', () => {
		return Requests.find( { status:'Closed' } );
	} );
}

/**
 * @memberOf 		module:models/Requests
 */
const Requests = new Model( {
	schema: RequestSchema,
	collection: "Issues",
	mixins: [
		[ Owners ],
		[ DocMessages, {
			helpers: {
				getInboxName() {
					return "work order #" + this.code + ' "' + this.getName() + '"';
				},
				getWatchers() {
					let user = Meteor.user(),
						owner = this.getOwner(),
						team = this.getTeam(),
						supplier = this.getSupplier(),
						assignee = this.assignee;
					return [ user, owner, team, supplier, assignee ];
				}
			}
		} ],
		[ Members ]
	]
} )

if ( Meteor.isServer ) {
	Requests.collection._ensureIndex( { 'team._id': 1 } );
	Requests.collection._ensureIndex( { 'owner._id': 1 } );
}

Requests.save.before( ( request ) => {
	if ( request.type == "Preventative" ) {
		request.status = "PMP";
		request.priority = "PMP";
	} else if ( request.type == "Booking" ) {
		request.status = "Booking";
		request.priority = "Booking";
	}
} );

// *********************** this is an insecure temporary solution for updating status of requests ***********************

Requests.collection.allow( {
	update: function() {
		return true
	},
	remove: function() {
		return true
	},
} );

// ******************************************


var accessForTeamMembers = function( role, user, request ) {
	return (
		isEditable( request ) &&
		AuthHelpers.memberOfRelatedTeam( role, user, request )
	)
}

var accessForTeamManagers = function( role, user, request ) {
	return (
		isEditable( request ) &&
		AuthHelpers.managerOfRelatedTeam( role, user, request )
	)
}

var accessForTeamMembersWithElevatedAccessForManagers = function( role, user, request ) {
	return (
		(
			request.status == "Issued" &&
			AuthHelpers.managerOfRelatedTeam( role, user, request )
		) ||
		(
			isEditable( request ) &&
			AuthHelpers.memberOfRelatedTeam( role, user, request )
		)
	)
}

//maybe actions it better terminology?
Requests.methods( {

	/* funtionality should be encapsulated in members */
	updateSupplierManagers: {
		authentication: true,
		helper: function( request ) {
			let roles = Roles.getRoles( request ),
				supplierManagers = roles.roles[ 'supplier manager' ],
				teamManagers = roles.roles[ 'team manager' ];

			if ( supplierManagers ) {
				request.dangerouslyReplaceMembers( supplierManagers, {
					role: "supplier manager"
				} );
			}

			if ( teamManagers ) {
				request.dangerouslyReplaceMembers( teamManagers, {
					role: "team manager"
				} );
			}
		}
	},

	/* just seems to be a simple calculated field - in schema??, location.toString(), address.toString() */
	getLocationString: {
		authentication: true,
		helper: function( request ) {
			var str = '';
			if ( request.level && request.level.name ) {
				str += request.level.name;
				if ( request.area && request.area.name ) {
					str += ( ', ' + request.area.name );
					if ( request.identifier && request.identifier.name ) {
						str += ( ', ' + request.identifier.name );
					}
				}
			}
			return str;
		}
	},

	create: {
		authentication: true,
		method: function( request ) {
			let status = 'New';

			if( request.type == 'Preventative' ) {
				status = 'PMP';
			}
			else if ( request.type == 'Booking' ) {
				status = 'Booking';
			}

			let code = null;
		 	if ( request && request.team ) {
		 		team = Teams.findOne( {
		 			_id: request.team._id
		 		} );
		 		code = team.getNextWOCode();
		 	}

			let newRequestId = Meteor.call( 'Issues.save', request, {
				status: status,
				issuedAt: new Date(),
				code: code
			} ),
				newRequest = null;

			if ( newRequestId ) {
				newRequest = Requests.findOne( newRequestId );
			}

			if ( newRequest ) {
				let owner = null;
				if( newRequest.owner ) {
					owner = newRequest.getOwner();
				}
				newRequest.distributeMessage( {
					recipientRoles: [ "team", "team manager", "facility", "facility manager" ],
					message: {
						verb: "created",
						subject: "A new work order has been created" + ( owner ? ` by ${owner.getName()}` : '' ),
						body: newRequest.description
					}
				} );
			}
			return newRequest;
		}
	},

	issue: {
		authentication: true,
		method: actionIssue
	},

	complete: {
		authentication: true,
		method: actionComplete
	},

	/* services toString()*/

	getServiceString: {
		authentication: true,
		helper: function( request ) {
			var str = '';
			if ( request.service ) {
				str += request.service.name;
			}
			if ( request.subservice && request.subservice.name ) {
				str += ( ' - ' + request.subservice.name );
			}
			return str;
		}
	},

	getNextDate: {
		authentication: true,
		helper: ( request ) => {
            if ( request.frequency ) {
                let dueDate = moment( request.dueDate ),
                	repeats = parseInt( request.frequency.repeats ),
                	period = {};

                period[ request.frequency.unit ] = parseInt( request.frequency.number );
                for ( var i = 0; i < repeats; i++ ) {

                	if( dueDate.isAfter() ) {
                		return dueDate.toDate();
                	}
                	dueDate = dueDate.add( period );
                }
            }
		}
	},

	getPreviousDate: {
		authentication: true,
		helper: ( request ) => {
            if ( request.frequency ) {
                let dueDate = moment( request.dueDate ),
                	repeats = parseInt( request.frequency.repeats ),
                	period = {};

                period[ request.frequency.unit ] = parseInt( request.frequency.number );
                for ( var i = 0; i < repeats; i++ ) {

                	if( dueDate.isAfter() ) {
                		dueDate.subtract( period ).toDate();
                	}
                	dueDate = dueDate.add( period );
                }
            }
		}
	},

	findCloneAt: {
		authentication: true,
		helper: ( request, dueDate ) => {
			return Requests.findOne( {
				name: request.name,
				status: { $ne: 'PMP' },
				dueDate: dueDate
			} );
		}
	},

	getTimeliness: {
		authentication: true,
		helper: ( request ) => {
			if( request.closeDetails && request.closeDetails.completionDate ) {
				var oneDay = 1000*60*60*24;
				var date1Ms = request.dueDate.getTime();
				var date2Ms = request.closeDetails.completionDate.getTime();
				var differenceMs = date1Ms - date2Ms;
				return Math.round(differenceMs/oneDay);
			}
		}
	},

	getNextRequest: {
		authentication: true,
		helper: ( request ) => {
			let nextDate = request.getNextDate(),
				nextRequest = null;

			if( nextDate ) {
				nextRequest = Requests.findOne({
					name: request.name,
					status: { $ne: 'PMP' },
					dueDate: nextDate
				} );
			}
			return nextRequest;
		}
	},

	getPreviousRequest: {
		authentication: true,
		helper: ( request ) => {
			let previousDate = request.getPreviousDate();
				previousRequest = null;

			if( previousDate ) {
				previousRequest = Requests.findOne({
					name: request.name,
					status: { $ne: 'PMP' },
					dueDate: previousDate
				} );
			}
			return previousRequest;
		}
	},

	getDocs: {
		authentication: true,
		helper: function( request ) {
			let docs = Documents.find( { request: { _id: request._id, name: request.name } } ).fetch();
			return _.map( docs, ( doc ) => {
				return {
					_id: doc._id,
					name: doc.name,
					type: doc.type,
					description: doc.description,
				}
			} );
		}
	},

	destroy: {
		authentication: true,
		helper: function( request ) {
			Requests.remove( { _id: request._id } );
		}
	},

	getSupplier: {
		authentication: true,
		helper: function( request ) {
			let supplierQuery = request.supplier;
			if ( supplierQuery ) {
				let supplier = Teams.findOne( { $or:[
					{ _id: supplierQuery._id },
					{ name: supplierQuery.name }
				] } );
				if( supplier == null ) {
					supplier = Teams.collection._transform( {} );
				}
				return supplier;
			}
		}
	},

	getTeam: {
		authentication: true,
		helper: function( request ) {
			let team = request.team;
			if ( team ) {
				let item = Teams.findOne( { _id: team._id } );
				return item != null ? item : Teams.collection._transform( {} );
			}
		}
	},

	getFacility: {
		authentication: true,
		helper: function( request ) {
			import { Facilities } from '/modules/models/Facilities';
			let query = request.facility;
			if ( query ) {
				let facility = Facilities.findOne( { _id: query._id } );
				return facility != null ? facility : Facilities.collection._transform( {} );
			}
		}
	},

	markRecipentAsRead: {
		authentication: true,
		helper: function( request ) {
			let user = Meteor.user();
			if( request.unreadRecipents && _.indexOf( request.unreadRecipents, user._id ) > -1 ){
				Requests.update( { _id: request._id }, {
						$pull:{
							unreadRecipents: user._id
						}
				})
			}
		}
	},

	setAssignee: {
		authentication: true,
		method: setAssignee
	},

	sendReminder: {
		authentication: true,
		method: actionSendReminder
	}

} )

Requests.helpers( {
	// this sent to schema config
	// or put in another package document-urls
	path: 'requests',
	getUrl() {
		return Meteor.absoluteUrl( this.path + '/' + this._id )
	},
	getEncodedPath() {
		return encodeURIComponent( Base64.encode( this.path + '/' + this._id ) );
	}
} );

Requests.helpers( {
	isOverdue: function() {
		return moment( this.dueDate )
			.isBefore();
	},
	isFollowUp: function() {
		return this.parent != null;
	},
} );

Requests.helpers( {
	//doc-attachments
	getAttachmentCount() {
		if ( this.attachments ) {
			return this.attachments.length;
		}
		return 0;
	},
} );


function actionCreate( request ) {

}

function setAssignee( request, assignee ) {

	Requests.update( request._id, {
		$set: {
			assignee: {
				_id: assignee._id,
				name: assignee.profile.name
			}
		}
	} );
	Requests.update( request._id, {
		$pull: { members: { role: "assignee" }
	} } );

	request = Requests.collection._transform( request );
	request.dangerouslyAddMember( request, assignee, { role: "assignee" } );
}

function actionIssue( request ) {

	let code = null;
 	if ( request && request.team && !request.code) {
 		team = Teams.findOne( {
 			_id: request.team._id
 		} );
 		code = team.getNextWOCode();
		Meteor.call( 'Issues.save', request, {
			status: "Issued",
			issuedAt: new Date(),
			code: code
		} );
 	} else {
		Meteor.call( 'Issues.save', request, {
			status: "Issued",
			issuedAt: new Date(),
		} );
 	}


	request = Requests.findOne( request._id );

	if ( request ) {
		request.updateSupplierManagers();
		request = Requests.findOne( request._id );
		request.distributeMessage( {
			recipientRoles: [ "owner", "team", "team manager", "facility", "facility manager" ],
			message: {
				verb: "issued",
				subject: "Work order #" + request.code + " has been issued",
			}
		} );

		var team = request.getTeam();
		request.distributeMessage( {
			recipientRoles: [ "supplier manager" ],
			suppressOriginalPost: true,
			message: {
				verb: "issued",
				subject: "New work request from " + " " + team.getName(),
				emailBody: function( recipient ) {
					var expiry = moment( request.dueDate ).add( { days: 3 } ).toDate();
					var token = LoginService.generateLoginToken( recipient, expiry );
					return DocMessages.render( SupplierRequestEmailView, { recipient: { _id: recipient._id }, item: { _id: request._id }, token: token } );
				}
			}
		} );

		return request;
	}
}

function actionComplete( request ) {

	if ( request.closeDetails ) {
		if( request.closeDetails.attachments ) {
			request.closeDetails.attachments.map( function( a ) {
				request.attachments.push( a );
			} );
		}
		if( request.closeDetails.furtherQuote ) {
			request.attachments.push( request.closeDetails.furtherQuote );
		}
		if( request.closeDetails.invoice ) {
			request.attachments.push( request.closeDetails.invoice );
		}
		if( request.closeDetails.serviceReport ) {
			request.attachments.push( request.closeDetails.serviceReport );
		}
	}

	Meteor.call( 'Issues.save', request, {
		status: 'Complete'
	} );
	request = Requests.findOne( request._id );

	if ( request.closeDetails.furtherWorkRequired ) {

		console.log( 'further work required' );

		var closer = Meteor.user(),
			closerRole = closer.getRole();

		var newRequest = {
			facility: request.facility,
			supplier: request.supplier,
			team: request.team,

			level: request.level,
			area: request.area,
			members: request.members,
			attachments: request.attachments || [],
			status: "New",
			service: request.service,
			subservice: request.subservice,
			name: "FOLLOW UP - " + request.name,
			description: request.closeDetails.furtherWorkDescription,
			priority: request.closeDetails.furtherPriority || 'Scheduled',
			costThreshold: request.closeDetails.furtherQuoteValue
		};

		var team = Teams.findOne(request.team._id );
		if( team ){
			newRequest.code = team.getNextWOCode();
		}

		//console.log( request._id );
		var response = Meteor.call( 'Issues.create', newRequest );
		//console.log( response._id );
		var newRequest = Requests.findOne( response._id );
		//ok cool - but why send notification and not distribute message?
		//is it because distribute message automatically goes to all recipients
		//I think this needs to be replaced with distribute message

		//previous request WO# change to show the WO# of new request
		request.distributeMessage( {
			message: {
				verb: "raised follow up",
				subject: "Work order #" + request.code + " has been completed and a follow up has been requested",
				target: newRequest.getInboxId()
			}
		} );

		newRequest.distributeMessage( {
			message: {
				verb: "raised follow up to",
				subject: closer.getName() + " requested a follow up to " + request.getName(),
				body: newRequest.description,
				target: request.getInboxId()
			}
		} );

		let roles = [ "portfolio manager", "facility manager", "team portfolio manager"]
		if ( _.indexOf( roles, closerRole ) > -1 ){
			Meteor.call( 'Issues.issue', newRequest );
		}


	} else {

		request.distributeMessage( {
			message: {
				verb: "completed",
				subject: "Work order #" + request.code + " has been completed"
			}
		} );

	}

	return request;
}

 function actionSendReminder ( requests ) {
	  requests.map( ( request ) => {
			request = Requests.findOne( request._id );
			team = request.getTeam();
			 request.distributeMessage( {
				 recipientRoles: [ "supplier manager" ],
				 message: {
					 subject: "Overdue Work order #"+ request.code+" reminder",
					 emailBody: function( recipient ) {
						 console.log(recipient);
						 var expiry = moment( request.dueDate ).add( { days: 3 } ).toDate();
						 var token = LoginService.generateLoginToken( recipient, expiry );
						 return DocMessages.render( OverdueWorkOrderEmailView, { recipient: { _id: recipient._id }, item: { _id: request._id }, token: token } );
					 }
				 },
				 suppressOriginalPost: true,
			 } );
			 if( !request.sendFirstReminder ){
				 Requests.update( { _id: request._id}, {
					 $set:{
						 firstReminderSent: true,
					 }
				 })
			 }
		})
 }

export default Requests;
