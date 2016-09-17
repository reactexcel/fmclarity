import React from 'react';

import { Action } from '/modules/core/Action';
import { Modal } from '/both/modules/Modal';
import { AutoForm } from '/modules/core/AutoForm';

import { Issues, CreateRequestForm } from '/modules/models/Request';

import RequestPanel from './imports/components/RequestPanel.jsx';

/*
const create = new Action( {
	label: "Create request",
	action: ( template ) => {
		let facility = Facilities.create( template );
		Modal.show( {
			content: <FacilityStepper item = { request } />
		} )
	}
} )
*/

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

const destroy = new Action( {
	name: "delete request",
	type: 'request',
	label: "Delete request",
	action: ( request ) => {
		//Facilities.destroy( request );
		request.destroy();
	}
} )

export {
	//create,
	edit,
	view,
	destroy,
}
