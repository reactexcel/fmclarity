import React from 'react';

import { Action } from '/modules/core/Action';
import { Modal } from '/modules/ui/Modal';
import { AutoForm } from '/modules/core/AutoForm';

import { Issues, CreateRequestForm } from '/modules/models/Requests';

import RequestPanel from './imports/components/RequestPanel.jsx';

const view = new Action( {
	name: "view request",
	type: 'request',
	label: "View request",
	action: ( request ) => {
		Modal.show( {
			content: <RequestPanel item = { request } />
		} )
	}
} )

const edit = new Action( {
	name: "edit request",
	type: 'request',
	label: "Edit request",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Issues }
				item = { request }
				form = { CreateRequestForm }
			/>
		} )
	}
} )

const destroy = new Action( {
	name: "delete request",
	type: 'request',
	label: "Delete request",
	action: ( request ) => {
		//Facilities.destroy( request );
		request.destroy();
	}
} )

const cancel = new Action( {
	name: "cancel request",
	type: 'request',
	label: "Cancel request",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Issues }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = { ( request ) => {
					request.save( { status: 'Cancelled' } )
				} }
			/>
		} )
	}
} )

const issue = new Action( {
	name: "issue request",
	type: 'request',
	label: "Issue request",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Issues }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = { ( request ) => {
					request.save( { status: 'Issued' } )
				} }
			/>
		} )
	}
} )

const accept = new Action( {
	name: "accept request",
	type: 'request',
	label: "Accept request",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Issues }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = { ( request ) => {
					request.save( { status:'In progress' } )
				} }
			/>
		} )
	}
} )

const reject = new Action( {
	name: "reject request",
	type: 'request',
	label: "Reject request",
	action: ( request ) => {
		Modal.show( {
			content: <AutoForm
				model = { Issues }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = { ( request ) => {
					request.save( { status:'In progress' } )
				} }
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
				model = { Issues }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = { ( request ) => {
					request.save( { status:'In progress' } )
				} }
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
				model = { Issues }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = { ( request ) => {
					request.save( { status:'In progress' } )
				} }
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
				model = { Issues }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = { ( request ) => {
					request.save( { status:'In progress' } )
				} }
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
				model = { Issues }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = { ( request ) => {
					request.save( { status:'In progress' } )
				} }
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
				model = { Issues }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = { ( request ) => {
					request.save( { status:'In progress' } )
				} }
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
				model = { Issues }
				item = { request }
				form = { CreateRequestForm }
				onSubmit = { ( request ) => {
					request.save( { status:'In progress' } )
				} }
			/>
		} )
	}
} )

export {
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
