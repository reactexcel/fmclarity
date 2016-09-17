import React from 'react';

import { Action } from '/modules/core/Action';
import { Modal } from '/modules/ui/Modal';

import { Facilities } from '/modules/models/Facility';

import FacilityStepper from './imports/components/FacilityStepper.jsx';
import FacilityPanel from './imports/components/FacilityPanel.jsx';

const create = new Action( {
	name: "create facility",
	type: 'facility',
	label: "Create facility",
	action: ( template ) => {
		let facility = Facilities.create( template );
		Modal.show( {
			content: <FacilityStepper facility = { facility } />
		} )
	}
} )

const edit = new Action( {
	name: "edit facility",
	type: 'facility',
	label: "Edit facility",
	action: ( facility ) => {
		Modal.show( {
			content: <FacilityStepper facility = { facility } />
		} )
	}
} )

const view = new Action( {
	name: "view facility",
	path: "/facility",
	type: 'facility',
	label: "View facility",
	action: ( facility ) => {
		Modal.show( {
			content: <FacilityPanel facility = { facility } />
		} )
	}
} )

const destroy = new Action( {
	name: "destroy facility",
	type: 'facility',
	label: "Delete facility",
	action: ( facility ) => {
		//Facilities.destroy( facility );
		facility.destroy();
	}
} )

export {
	create,
	edit,
	view,
	destroy,
	checkRoles
}
