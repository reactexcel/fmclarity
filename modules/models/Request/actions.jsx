import React from 'react';

import { Action } from '/both/modules/Action';
import { Modal } from '/both/modules/Modal';
import { AutoForm } from '/both/modules/AutoForm';

import { Issues, CreateRequestForm } from '/modules/models/Request';

import RequestPanel from './imports/components/RequestPanel.jsx';

/*
const create = new Action( {
	label: "Create request",
	run: ( template ) => {
		let facility = Facilities.create( template );
		Modal.show( {
			content: <FacilityStepper item = { request } />
		} )
	}
} )
*/

const edit = new Action( {
	label: "Edit request",
	run: ( request ) => {
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
	label: "View request",
	run: ( request ) => {
		Modal.show( {
			content: <RequestPanel item = { request } />
		} )
	}
} )

const destroy = new Action( {
	label: "Delete request",
	run: ( request ) => {
		//Facilities.destroy( request );
		request.destroy();
	}
} )

const checkRoles = new Action( {
	label: "Check roles",
	run: ( request ) => {
		console.log( Issues.getRoles( request ) );
	}
} )

export {
	//create,
	edit,
	view,
	destroy,
	checkRoles
}
