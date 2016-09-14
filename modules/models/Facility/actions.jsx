import React from 'react';

import { Action } from '/both/modules/Action';
import { Modal } from '/both/modules/Modal';

import { Facilities } from '/modules/models/Facility';

import FacilityStepper from './imports/components/FacilityStepper.jsx';
import FacilityPanel from './imports/components/FacilityPanel.jsx';

const create = new Action( {
	label: "Create facility",
	run: ( template ) => {
		let facility = Facilities.create( template );
		Modal.show( {
			content: <FacilityStepper facility = { facility } />
		} )
	}
} )

const edit = new Action( {
	label: "Edit facility",
	run: ( facility ) => {
		Modal.show( {
			content: <FacilityStepper facility = { facility } />
		} )
	}
} )

const view = new Action( {
	label: "View facility",
	run: ( facility ) => {
		Modal.show( {
			content: <FacilityPanel facility = { facility } />
		} )
	}
} )

const destroy = new Action( {
	label: "Delete facility",
	run: ( facility ) => {
		//Facilities.destroy( facility );
		facility.destroy();
	}
} )

const checkRoles = new Action( {
	label: "Check roles",
	run: ( facility ) => {
		console.log( Facilities.getRoles( facility ) );
	}
} )

export {
	create,
	edit,
	view,
	destroy,
	checkRoles
}
