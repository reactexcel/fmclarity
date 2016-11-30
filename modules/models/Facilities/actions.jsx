import React from 'react';

import { Action } from '/modules/core/Actions';
import { Modal } from '/modules/ui/Modal';

import { Facilities } from '/modules/models/Facilities';

import FacilityStepperContainer from './imports/containers/FacilityStepperContainer.jsx';
import FacilityPanel from './imports/components/FacilityPanel.jsx';

const edit = new Action( {
	name: "edit facility",
	type: 'facility',
	label: "Edit facility",
	action: ( facility ) => {
		console.log( facility );
		Modal.show( {
			content: <FacilityStepperContainer params = { { item: facility } } />
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
			content: <FacilityPanel item = { facility } />
		} )
	}
} )

const destroy = new Action( {
	name: "destroy facility",
	type: 'facility',
	label: "Delete facility",
	shouldConfirm: true,
	verb:  {
		shouldConfirm: true,
	},
	action: ( facility ) => {
		//Facilities.destroy( facility );
		facility.destroy();
	}
} )

export {
	edit,
	view,
	destroy
}
