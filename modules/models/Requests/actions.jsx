 import React from 'react';

import { Modal } from '/modules/ui/Modal';
import { Action } from '/modules/core/Actions';
import { AutoForm } from '/modules/core/AutoForm';

import { Requests, CreateRequestForm } from '/modules/models/Requests';

import RequestPanel from './imports/components/RequestPanel.jsx';

const create = new Action( {
	name: "create request",
	type: 'request',
	label: "Create",
	action: ( request ) => {
		Requests.update( request._id, { $set: {
			code: request.code||request.team.getNextWOCode(),
			status: 'New'
		} } );
	}
} )

const view = new Action( {
	name: "view request",
	type: 'request',
	label: "View",
	action: ( request ) => {
		Modal.show( {
			content: <RequestPanel item = { request } />
		} )
	}
} )

const edit = new Action( {
	name: "edit request",
	type: 'request',
	label: "Edit",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				title 	= "Edit Request"
				model 	= { Requests }
				item 	= { request }
				form 	= { CreateRequestForm }
				onSubmit = { () => {
					Modal.hide();
				} }
			/>
		} )
	}
} )

const destroy = new Action( {
	name: "destroy request",
	type: 'request',
	label: "Delete",
	action: ( request ) => {
		//Facilities.destroy( request );
		request.destroy();
    Modal.hide();
	}
} )

const deleteFunction = new Action( {
	name: "delete request",
	type: 'request',
	label: "Delete",
  	shouldConfirm: true,
	verb: 'deleted request',
	action: ( request, callback ) => {
		Requests.update( request._id, { $set: { status: 'Deleted' } } );
		Modal.hide();
		callback( request );
	}
} )

const cancel = new Action( {
	name: "cancel request",
	type: 'request',
	verb: "cancelled a work order",
	label: "Cancel",
	action: ( request, callback ) => {
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { [ 'rejectComment' ] }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'Cancelled' } } );
						Modal.hide();
						callback( request );
					}
				}
			/>
		} )
	}
} )

const issue = new Action( {
	name: "issue request",
	type: 'request',
	verb: "issued a work order",
	label: "Issue",
	action: ( request, callback ) => {
		console.log( request );
		Requests.update( request._id, { $set: {
			code: request.code||request.team.getNextWOCode(),
			status: 'Issued'
		} } );
		request.updateSupplierManagers();
		callback( request );
		/*
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { [ 'issueComment' ] }
				onSubmit = {
					( request ) => {
						Modal.hide();
						console.log( request );
						Requests.update( request._id, { $set: { status: 'Issued' } } );
						request.updateSupplierManagers();
					}
				}
			/>
		} )
		*/
	}
} )

const accept = new Action( {
	name: "accept request",
	type: 'request',
	verb: "accepted a work order",
	label: "Accept",
	action: ( request, callback ) => {
		Modal.show( {
			content: <AutoForm
				title 	= "Please provide eta and, if appropriate, an assignee."
				model 	= { Requests }
				item 	= { request }
				form 	= { [ 'eta', 'assignee', 'acceptComment' ] }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'In Progress' } } );
						Modal.hide();
						callback( request );
					}
				}
			/>
		} )
	}
} )

const reject = new Action( {
	name: "reject request",
	type: 'request',
	verb: "rejected a work order",
	label: "Reject",
	action: ( request, callback ) => {
		Modal.show( {
			content: <AutoForm
				title 	= "What is your reason for rejecting this request?"
				model 	= { Requests }
				item 	= { request }
				form 	= { [ 'rejectComment' ] }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'Rejected' } } );
						Modal.hide();
						callback( request );
					}
				}
			/>
		} )
	}
} )

const getQuote = new Action( {
	name: "get request quote",
	type: 'request',
	label: "Get quote",
	action: ( request, callback ) => {
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'In Progress' } } );
						Modal.hide();
						callback( request );
					}
				}
			/>
		} )
}
} )

const sendQuote = new Action( {
	name: "send request quote",
	type: 'request',
	label: "Quote",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'In Progress' } } );
						Modal.hide();
					}
				}
			/>
		} )
}
} )

const complete = new Action( {
	name: 'complete request',
	type: 'request',
	verb: "completed a work order",	
	label: "Complete",
	action: ( request, callback ) => {
		Modal.show( {
			content: <AutoForm
				title 	= "All done? Great! We just need a few details to finalise the job."
				model 	= { Requests }
				item 	= { request }
				form 	= { [ 'closeDetails' ] }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'Complete' } } );
						//Requests.createFollowUp( request );
						Modal.hide();
						callback( request );
					}
				}
			/>
		} )
	}
} )

const close = new Action( {
	name: "close request",
	type: 'request',
	verb: "closed a work order",
	label: "close",
	action: ( request, callback ) => {
		Modal.show( {
			content: <AutoForm
				title 	= "Please leave a comment about the work for the suppliers record"
				model 	= { Requests }
				item 	= { request }
				form 	= { [ 'closeComment' ] }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'Closed' } } );
						Modal.hide();
						callback( request );
					}
				}
			/>
		} )
	}
} )

const reopen = new Action( {
	name: "reopen request",
	type: 'request',
	label: "Reopen",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'New' } } )
						Modal.hide();
					}
				}
			/>
		} )
	}
} )

const reverse = new Action( {
	name: "reverse request",
	type: 'request',
	label: "Reverse",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { [ 'reverseComment' ] }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'Reversed' } } )
						Modal.hide();
					}
				}
			/>
		} )
	}
} )

export {
	create,
	view,
	edit,
	destroy,
	cancel, //delete
	issue, //approve
	accept,
	reject,
	getQuote,
	sendQuote,
	complete,
	close,
	reopen,
	reverse
}
