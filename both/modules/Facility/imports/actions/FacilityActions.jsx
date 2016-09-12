import React from 'react';
import { Modal } from '/both/modules/Modal';
import FacilityStepper from '../components/FacilityStepper.jsx';
import FacilityPanel from '../components/FacilityPanel.jsx';

function createFacility( template={} ) {
	return {
		label: "Create facility",
		authentication: true,
		action: () => {
			Modal.show( {
				content: <FacilityStepper facility = { template } />
			} )
		},
		notification: () => {
			///blah
		}
	}
}

function editFacility( facility ) {
	return {
		label: "Edit facility",
		authentication: true,
		action: () => {
			Modal.show( {
				content: <FacilityStepper facility = { facility } />
			} )
		},
		notification: () => {
			///blah
		}
	}
}

function viewFacility( facility ) {
	return {
		label: "View facility",
		authentication: true,
		action: () => {
			Modal.show( {
				content: <FacilityPanel facility = { facility } />
			} )
		},
		notification: () => {
			///blah
		}
	}
}

function deleteFacility( facility ) {
	return {
		label: "Delete facility",
		authentication: true,
		action: () => {
			//Facilities.destroy( facility );
			facility.destroy();
		},
		notification: () => {
			///blah
		}
	}
}

export {
	createFacility,
	editFacility,
	viewFacility,
	deleteFacility
}
