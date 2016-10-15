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
		Requests.update( request._id, { $set: { status: 'New' } } );
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
				model = { Requests }
				item = { request }
				form = { CreateRequestForm }
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
	action: ( request ) => {
		Requests.update( request._id, { $set: { status: 'Deleted' } } );
		Modal.hide();
	}
} )

const cancel = new Action( {
	name: "cancel request",
	type: 'request',
	label: "Cancel",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { [ 'rejectComment' ] }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'Cancelled' } } );
						Modal.hide();
					}
				}
			/>
		} )
	}
} )

const issue = new Action( {
	name: "issue request",
	type: 'request',
	label: "Issue",
	action: ( request ) => {
		console.log( request );
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { [ 'issueComment' ] }
				onSubmit = {
					( request ) => {
						console.log( request );
						Requests.update( request._id, { $set: { status: 'Issued' } } );
						request.updateSupplierManagers();
						Modal.hide();
					}
				}
			/>
		} )
	}
} )

const accept = new Action( {
	name: "accept request",
	type: 'request',
	label: "Accept",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { [ 'acceptComment' ] }
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

const reject = new Action( {
	name: "reject request",
	type: 'request',
	label: "Reject",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { [ 'rejectComment' ] }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'Rejected' } } );
						Modal.hide();
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
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'In Progress' } } );
						Modal.hide()
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
	name: "complete request",
	type: 'request',
	label: "Complete",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { [ 'closeDetails' ] }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'Complete' } } );
						Modal.hide();
					}
				}
			/>
		} )
	}
} )

const close = new Action( {
	name: "close request",
	type: 'request',
	label: "close",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Requests }
				item = { request }
				form = { [ 'closeComment' ] }
				onSubmit = {
					( request ) => {
						Requests.update( request._id, { $set: { status: 'Closed' } } );
						Modal.hide();
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
