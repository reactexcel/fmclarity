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
		Requests.save.call( request, { status: 'New' } );
		Modal.hide();
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
			/>
		} )
	}
} )

const destroy = new Action( {
	name: "delete request",
	type: 'request',
	label: "Delete",
	action: ( request ) => {
		//Facilities.destroy( request );
		request.destroy();
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
			form = { CreateRequestForm }
			onSubmit = {
				( request ) => {
					request.save( { status: 'Cancelled' } )
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
		Modal.show( {
			content: <AutoForm
			model = { Requests }
			item = { request }
			form = { CreateRequestForm }
			onSubmit = {
				( request ) => {
					request.save( { status: 'Issued' } )
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
			form = { CreateRequestForm }
			onSubmit = {
				( request ) => {
					request.save( { status: 'In progress' } )
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
			form = { CreateRequestForm }
			onSubmit = {
				( request ) => {
					request.save( { status: 'In progress' } )
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
					request.save( { status: 'In progress' } )
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
					request.save( { status: 'In progress' } )
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
			form = { CreateRequestForm }
			onSubmit = {
				( request ) => {
					request.save( { status: 'In progress' } )
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
			form = { CreateRequestForm }
			onSubmit = {
				( request ) => {
					request.save( { status: 'In progress' } )
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
					request.save( { status: 'In progress' } )
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
			form = { CreateRequestForm }
			onSubmit = {
				( request ) => {
					request.save( { status: 'In progress' } )
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
