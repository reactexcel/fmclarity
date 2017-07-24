// This file to be coupled with WOActionButtons and packaged

import React from 'react';

import { WorkflowHelper } from '/modules/core/WorkflowHelper';

import Requests from '../Requests.jsx';

import moment from 'moment';


Requests.workflow = new WorkflowHelper( Requests );

function actionGetQuote( request, user ) {
	Requests.save.call( request, {
		quoteIsPreApproved: request.quoteIsPreApproved,
		status: 'Quoting'
	} );

	request = Requests.findOne( request._id );
	request.updateSupplierManagers();
	request = Requests.findOne( request._id );

	request.distributeMessage( {
		recipientRoles: [ "owner", "team", "team manager", "facility", "facility manager", "supplier manager", "supplier" ],
		message: {
			verb: "requested a quote for",
			subject: "Work order #" + request.code + " has a new quote request"
		}
	} );
}

function actionEdit( request, user ) {
	if ( request.type == "Preventative" ) {
		request.status = "PPM";
		request.priority = "PPM";
	}
	Requests.save.call( request );
}

//////////////////////////////////////////////////////
// Draft
//////////////////////////////////////////////////////
Requests.workflow.addState( [ 'Draft' ], {
	edit: {
		label: 'Edit',
		authentication: AuthHelpers.managerOfRelatedTeam,
		validation: true,
		form: {
			title: "Edit request.",
			fields: Requests.forms.create,
			//onSubmit: actionEdit
		},
		method: actionEdit
	},

	create: {
		label: "Create", //dont think this is used?

		authentication: ( ...args ) => {
			AuthHelpers.memberOfRelatedTeam( ...args ) && !AuthHelpers.managerOfRelatedTeam( ...args )
		},

		validation( request ) {
			return true;
			return (
				request.name && request.name.length &&
				request.facility && request.facility._id &&
				request.level && request.level.name && request.level.name.length &&
				request.service && request.service.name.length
			)
		},

		form: {
			title: "Please tell us a little bit more about the work that is required.",
			fields: Requests.forms.create
		},

		method: function( request ) {
			if ( request.type == "Preventative" ) {
				request.status = "PPM";
				request.priority = "PPM";
			} else {
				request.status = "New";
			}

			Requests.save.call( request );

			request = Requests.findOne( request._id );
			request.distributeMessage( {
				recipientRoles: [ "team", "team manager", "facility", "facility manager", "supplier" ],
				message: {
					verb: "created",
					subject: `Work order #${request.code} has been created`,
					body: request.description
				}
			} );
		}
	},

	approve: {
		label: 'Approve',
		authentication: AuthHelpers.managerOfRelatedTeam,
		validation( request ) {
			return ( request.supplier && ( request.supplier._id || request.supplier.name ) )
		},
		/*form:{
			title:"Do you require quotes for this job?",
			fields:['quoteRequired','confirmRequired']
	 	},*/
		method: actionIssue, //onSubmit?
	},

	'get quote': {
		label: 'Get quote',
		authentication: AuthHelpers.managerOfRelatedTeam,
		validation( request ) {
			return ( request.supplier && ( request.supplier._id || request.supplier.name ) )
		},
		form: {
			title: "Do you want to pre-approve this quote?",
			fields: [ 'quoteIsPreApproved' ]
		},
		method: actionGetQuote
	},

	delete: {
		label: 'Delete',
		authentication: [ "owner", "facility manager", "team manager" ],
		method: function( request ) {
			Requests.remove( request._id );
			Modal.hide();
		}
	}
} )

//////////////////////////////////////////////////////
// PMP
//////////////////////////////////////////////////////
Requests.workflow.addState( [ 'PPM' ], {

	edit: {
		label: 'Edit',
		authentication: AuthHelpers.managerOfRelatedTeam,
		validation: true,
		form: {
			title: "Edit request.",
			fields: Requests.forms.create,
			//onSubmit: actionEdit
		},
		method: actionEdit
	},

	create: {
		label: "Instantiate", //dont think this is used?

		authentication: ( ...args ) => {
			AuthHelpers.memberOfRelatedTeam( ...args ) && !
				AuthHelpers.managerOfRelatedTeam( ...args )
		},

		validation( request ) {
			//console.log(request);
			return true;
			return (
				request.name && request.name.length &&
				request.facility && request.facility._id &&
				request.level && request.level.name && request.level.name.length &&
				request.service && request.service.name.length
			)
		},

		form: {
			title: "Please tell us a little bit more about the work that is required.",
			fields: Requests.forms.create,
			/*validation: function( request )
			{
				//console.log(request);
				return true;
				return (
					request.name && request.name.length &&
					request.facility && request.facility._id &&
					request.level && request.level.name && request.level.name.length &&
					request.service && request.service.name.length
				)
			},*/
		},

		method: function( request ) {
			if ( request.type == "Preventative" ) {
				request.status = "PPM";
				request.priority = "PPM";
			} else {
				request.status = "New";
			}

			Requests.save.call( request );
			request = Requests.findOne( request._id );
			request.distributeMessage( {
				recipientRoles: [ "team", "team manager", "facility", "facility manager", "supplier" ],
				message: {
					verb: "created",
					subject: "Work order #" + request.code + " has been created",
					body: request.description
				}
			} );
		}
	},

	approve: {
		label: 'Instantiate',
		authentication: AuthHelpers.managerOfRelatedTeam,
		validation( request ) {
			return ( request.supplier && ( request.supplier._id || request.supplier.name ) )
		},
		/*form:{
		title:"Do you require quotes for this job?",
		fields:['quoteRequired','confirmRequired']
	 },*/
		method: actionIssue, //onSubmit?
	},

	delete: {
		label: 'Delete',
		authentication: [ "owner", "facility manager", "team manager" ],
		method: function( request ) {
			Requests.remove( request._id );
			Modal.hide();
		}
	}
} )

//////////////////////////////////////////////////////
// New, Quoted
//////////////////////////////////////////////////////
Requests.workflow.addState( [ 'New', 'Quoted' ], {

	edit: {
		label: 'Edit',
		authentication: AuthHelpers.managerOfRelatedTeam,
		validation: true,
		form: {
			title: "Edit request.",
			fields: Requests.forms.create,
			//onSubmit: actionEdit
		},
		method: actionEdit
	},

	approve: {
		label: 'Approve',
		authentication: AuthHelpers.managerOfRelatedTeam,
		validation: function( request ) {
			return ( request.supplier && ( request.supplier._id || request.supplier.name ) )
		},
		/*form:{
		title:"Do you require quotes for this job?",
		fields:['quoteRequired','confirmRequired']
	 },*/
		method: actionIssue, //onSubmit?
	},

	'get quote': {
		label: 'Get quote',
		authentication: AuthHelpers.managerOfRelatedTeam,
		validation: function( request ) {
			return ( request.supplier && ( request.supplier._id || request.supplier.name ) )
		},
		form: {
			title: "Do you want to pre-approve this quote?",
			fields: [ 'quoteIsPreApproved' ]
		},
		method: actionGetQuote
	},

	reject: {
		label: 'Reject',
		authentication: AuthHelpers.managerOfRelatedTeam,
		form: {
			title: "What is your reason for rejecting this request?",
			fields: [ 'rejectDescription' ]
		},
		method: function( request ) {
			Requests.save.call( request, { status: "Rejected" } );
			request = Requests._transform( request );
			request.distributeMessage( {
				recipientRoles: [ "owner", "team", "team manager", "facility", "facility manager", "supplier" ],
				message: {
					verb: "rejected",
					subject: "Work order #" + request.code + " has been rejected",
					body: request.rejectDescription
				}
			} );
		}
	}
} )

//////////////////////////////////////////////////////
// Quoting
//////////////////////////////////////////////////////
Requests.workflow.addState( 'Quoting', {
	'send quote': {
		label: "Quote",
		authentication: AuthHelpers.memberOfSuppliersTeam,
		validation: true,
		form: {
			title: "Please attach you quote document and fill in the value",
			//so this should prob be a subschema???
			fields: [ 'quote', 'quoteValue' ]
		},
		method: function( request ) {
			Requests.save.call( request, {
				costThreshold: parseInt( request.quoteValue ),
				status: request.quoteIsPreApproved ? 'In Progress' : 'Quoted'
			} );
			request = Requests.findOne( request._id );
			request.distributeMessage( {
				recipientRoles: [ "owner", "team", "team manager", "facility manager", "supplier" ],
				message: {
					verb: "provided a quote for",
					subject: "Work order #" + request.code + " has a new quote",
					body: request.rejectDescription
				}
			} );
		}
	}
} )

//////////////////////////////////////////////////////
// Issued
//////////////////////////////////////////////////////
Requests.workflow.addState( 'Issued', {
	accept: {
		label: "Accept",
		//so this should be more of a hide:function() pattern
		form: {
			title: "Please provide eta and, if appropriate, an assignee.",
			//so this should prob be a subschema???
			fields: [ 'eta','assignee','acceptComment' ]
		},
		authentication: AuthHelpers.memberOfSuppliersTeam,
		validation: function( request ) {
			return !request.quoteRequired || request.quote;
		},
		method: function( request, user ) {
			//console.log( request );
			var assignee = request.assignee;
			Requests.save.call( request, {
				status: 'In Progress',
				eta: request.eta,
				acceptComment: request.acceptComment
			} );
			request = Requests._transform( request );
			request.setAssignee( request.assignee );
			request.distributeMessage( {
				recipientRoles: [ "owner", "team", "team manager", "facility manager" ],
				message: {
					verb: "accepted",
					subject: "Work order #" + request.code + " has been accepted by the supplier",
					body: request.acceptComment
				}
			} );
		}
	},



	reject: {
		label: 'Reject',
		authentication: AuthHelpers.memberOfSuppliersTeam,
		form: {
			title: "What is your reason for rejecting this request?",
			form: [ 'rejectDescription' ]
		},
		method: function( request ) {
			Requests.save.call( request, {
				status: "Rejected"
			} );
			request = Requests.findOne( request._id );
			request.distributeMessage( {
				recipientRoles: [ "owner", "team", "team manager", "facility", "facility manager" ],
				message: {
					verb: "rejected",
					subject: "Work order #" + request.code + " has been rejected by the supplier",
					body: request.rejectDescription
				}
			} );
		}
	},


	delete: {
		label: 'Delete',
		authentication: AuthHelpers.managerOfRelatedTeam,
		form: {
			title: "What is your reason for deleting this request?",
			fields: [ 'rejectDescription' ]
		},
		method: function( request ) {
			Requests.save.call( request, {
				status: Requests.STATUS_DELETED
			} );
			request = Requests.findOne( request._id );
			request.distributeMessage( {
				recipientRoles: [ "team", "team manager", "facility manager", "supplier manager", "supplier" ],
				message: {
					verb: "deleted",
					subject: "Work order #" + request.code + " has been deleted",
					body: request.rejectDescription
				}
			} );
			return request;
		}
	},
} )

//////////////////////////////////////////////////////
// In Progress
//////////////////////////////////////////////////////
Requests.workflow.addState( 'In Progress', {
	complete: {
		label: 'Complete',
		authentication: AuthHelpers.memberOfSuppliersTeam,
		validation: true,
		form: actionBeforeComplete,
		method: actionComplete
	},
} )

//////////////////////////////////////////////////////
// Complete
//////////////////////////////////////////////////////
Requests.workflow.addState( 'Complete', {

	close: {
		label: 'Close',
		authentication: AuthHelpers.managerOfRelatedTeam,
		validation: true,
		form: {
			title: "Please leave a comment about the work for the suppliers record",
			fields: [ 'closeComment' ]
		},
		method: function( request ) {
			Requests.save.call( request, {
				status: 'Closed'
			} );
			request = Requests._transform( request );
			request.distributeMessage( {
				recipientRoles: [ "team", "team manager", "facility manager", "supplier manager", "supplier" ],
				message: {
					verb: "closed",
					subject: "Work order #" + request.code + " has been closed",
					body: request.closeComment
				}
			} );
		}
	},

	reopen: {
		label: 'Reopen',
		authentication: AuthHelpers.managerOfRelatedTeam,
		validation: true,
		form: {
			title: "What is your reason for re-opening this work order?",
			fields: [ 'reopenReason' ]
		},
		method: function( request ) {
			Requests.save.call( request, {
				status: 'New'
			} );
		}
	}

} )

//////////////////////////////////////////////////////
// Closed
//////////////////////////////////////////////////////
Requests.workflow.addState( 'Closed', {
	reverse: {
		label: 'Reverse',
		authentication: AuthHelpers.managerOfRelatedTeam,
		beforeMethod: {
			title: "What is your reason for reversing this request?",
			form: [ 'rejectDescription' ]
		},
		method: actionReverse
	}
} )

//this should be replaced with... um... something related to get state
//could we have status groups?
//Draft = ["Draft"]
//Open = ["New","Issued","In Progress"]
//Closed = ["Closed"]
//Rejected = ["Rejected","Cancelled","Deleted"]

Requests.STATUS_DRAFT = "Draft";
Requests.STATUS_NEW = "New";
Requests.STATUS_ISSUED = "Issued";
Requests.STATUS_ASSIGNED = "Issued";
Requests.STATUS_CLOSING = "Closing";
Requests.STATUS_CLOSED = "Closed";
Requests.STATUS_REVIEWED = "Reviewed";
Requests.STATUS_CANCELLED = "Cancelled";
Requests.STATUS_DELETED = "Deleted";
Requests.STATUS_ARCHIVED = "Archived";

//////////////////////////////////////////////////////////
// Issue
//////////////////////////////////////////////////////////
function actionIssue( request ) {
	Requests.save.call( request, {
		status: Requests.STATUS_ISSUED,
		issuedAt: new Date()
	} );
	request = Requests.findOne( request._id );
	request.updateSupplierManagers();
	request = Requests.findOne( request._id );
	request.distributeMessage( {
		recipientRoles: [ "owner", "team", "team manager", "facility", "facility manager","supplier" ],
		message: {
			verb: "issued",
			subject: "Work order #" + request.code + " has been issued",
		}
	} );

	request.distributeMessage( {
		recipientRoles: [ "supplier manager", "supplier" ],
		suppressOriginalPost: true,
		message: {
			verb: "issued",
			subject: "New work request from " + " " + request.team.name,
			emailBody: function( recipient ) {
				var expiry = moment( request.dueDate )
					.add( {
						days: 3
					} )
					.toDate();
				var token = FMCLogin.generateLoginToken( recipient, expiry );
				return DocMessages.render( SupplierRequestEmailView, {
					recipient: {
						_id: recipient._id
					},
					item: {
						_id: request._id
					},
					token: token
				} );
			}
		}
	} );

	return request;
}

//////////////////////////////////////////////////////////
// Close
//////////////////////////////////////////////////////////
function actionBeforeComplete( request ) {

	request = Requests._transform( request );
	var now = new Date();

	request.closeDetails = {
		closeDetails: {
			attendanceDate: now,
			completionDate: now
		}
	}

	return {
		title: "All done? Great! We just need a few details to finalise the job.",
		fields: [ 'closeDetails' ]
	}
}

function actionComplete( request ) {
	Requests.save.call( request, {
		status: 'Complete',
		closeDetails: request.closeDetails
	} )

	request = Requests.findOne( request._id );

	//console.log( request );

	if ( request.closeDetails.furtherWorkRequired ) {

		console.log( 'further work required' );

		var closer = Meteor.user();

		var newRequest = {
			facility: request.facility,
			supplier: request.supplier,
			team: request.team,

			location: request.location,
			level: request.level,
			area: request.area,
			status: Requests.STATUS_NEW,
			service: request.service,
			subservice: request.subservice,
			name: "FOLLOW UP - " + request.name,
			description: request.closeDetails.furtherWorkDescription,
			priority: request.closeDetails.furtherPriority || 'Scheduled',
			costThreshold: request.closeDetails.furtherQuoteValue
		};

		if ( request.closeDetails.furtherQuote ) {
			newRequest.attachments = [ request.closeDetails.furtherQuote ];
		}

		var response = Meteor.call( 'Issues.create', newRequest );
		//console.log( response );
		var newRequest = Requests._transform( response );
		//ok cool - but why send notification and not distribute message?
		//is it because distribute message automatically goes to all recipients
		//I think this needs to be replaced with distribute message
		request.distributeMessage( {
			message: {
				verb: "completed",
				subject: "Work order #" + request.code + " has been completed and a follow up has been requested"
			}
		} );

		/*newRequest.distributeMessage( {
			message: {
				verb: "requested a follow up to " + request.getName(),
				subject: closer.getName() + " requested a follow up to " + request.getName(),
				body: newRequest.description
			}
		} );*/
	} else {

		request.distributeMessage( {
			message: {
				verb: "completed",
				subject: "Work order #" + request.code + " has been completed"
			}
		} );

	}

	if ( request.closeDetails.attachments ) {
		request.closeDetails.attachments.map( function( a ) {
			request.attachments.push( a );
			request.save();
		} );
	}

	return request;
}

//////////////////////////////////////////////////////////
// Reverse
//////////////////////////////////////////////////////////
function actionReverse( request ) {
	//save current request
	Requests.save.call( request, {
		status: Requests.STATUS_CLOSED,
		priority: "Closed",
		name: "Reversed - " + request.name,
		reversed: true
	} );

	//create new request
	var newRequest = _.omit( request, '_id' );
	_.extend( newRequest, {
		status: "Reversed",
		code: 'R' + request.code,
		exported: false,
		costThreshold: request.costThreshold * -1,
		name: "Reversal - " + request.name
	} );
	var response = Meteor.call( 'Issues.create', newRequest );
	//distribute message on new request
	request = Requests.findOne( request._id );
	request.distributeMessage( {
		recipientRoles: [ "team", "team manager", "facility manager", "supplier manager", "supplier" ],
		message: {
			verb: "requested",
			subject: "Work order #" + request.code + " has been reversed and reversal #" + newRequest.code + " has been created"
		}
	} );
	return newRequest; //perhaps we should just be passing around ids?
}


/*
Requests.methods({
  close:{
	 method:actionClose,
	 authentication:truefunction(role,user,request) {
		return (
		  readyToClose(request)&&
		  (
			 AuthHelpers.managerOfRelatedTeam(role,user,request)||
			 AuthHelpers.memberOfSuppliersTeam(role,user,request)
		  )
		)
	 }
  },
  reverse:{
	 method:reverse,
	 authentication:function(role,user,request) {
		return (
		  request.exported&&request.status==Requests.STATUS_ISSUED&&
		  AuthHelpers.managerOfRelatedTeam(role,user,request)
		)
	 }
  },
  open:{
	 authentication:function (role,user,request) {
		return (
		  readyToOpen(request)&&
		  AuthHelpers.memberOfRelatedTeam(role,user,request)
		)
	 },
	 method:actionOpen
  },
  issue:{
	 method:issue,
	 authentication:function (role,user,request) {
		return (
		  readyToIssue(request)&&
		  AuthHelpers.managerOfRelatedTeam(role,user,request)
		)
	 }
  },
  startClosure:{
	 method:startClosure,
	 authentication:function(role,user,request) {
		return (
		  request.status==Requests.STATUS_ISSUED&&
		  (
			 AuthHelpers.managerOfRelatedTeam(role,user,request)||
			 AuthHelpers.memberOfSuppliersTeam(role,user,request)
		  )
		)
	 }
  },
  close:{
	 method:close,
	 authentication:function(role,user,request) {
		return (
		  readyToClose(request)&&
		  (
			 AuthHelpers.managerOfRelatedTeam(role,user,request)||
			 AuthHelpers.memberOfSuppliersTeam(role,user,request)
		  )
		)
	 }
  },
  destroy:{
	 method:actionDestroy,
	 authentication:function(role,user,request) {
		return (
		  readyToCancel(request)&&
		  (role=="owner"||AuthHelpers.managerOfRelatedTeam(role,user,request))
		)
	 }
  },
  cancel:{
	 method:actionCancel,
	 authentication:function(role,user,request) {
		return (
		  readyToCancel(request)&&
		  (role=="owner"||AuthHelpers.managerOfRelatedTeam(role,user,request))
		)
	 }
  },
})
*/
