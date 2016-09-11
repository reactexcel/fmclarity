import React from 'react';
import { Modal } from 'meteor/fmc:modal';
import { TeamStepper } from '../components/TeamStepper.jsx';
import { TeamPanel } from '../components/TeamPanel.jsx';

function createTeam( template={} ) {
	return {
		label: "Create team",
		authentication: true,
		action: () => {
			Modal.show( {
				content: <TeamStepper item = { template } />
			} )
		},
		notification: () => {
			///blah
		}
	}
}

function editTeam( team ) {
	return {
		label: "Edit team",
		authentication: true,
		action: () => {
			Modal.show( {
				content: <TeamStepper item = { team } />
			} )
		},
		notification: () => {
			///blah
		}
	}
}

function viewTeam( team ) {
	return {
		label: "View team",
		authentication: true,
		action: () => {
			Modal.show( {
				content: <TeamPanel team = { team } />
			} )
		},
		notification: () => {
			///blah
		}
	}
}

function deleteTeam( team ) {
	return {
		label: "Delete team",
		authentication: true,
		action: () => {
			//Facilities.destroy( team );
			team.destroy();
		},
		notification: () => {
			///blah
		}
	}
}

function removeSupplier( team, supplier ) {
	if( !team ) {
		return;
	}
	return {
		label: "Remove supplier from " + team.name,
		shouldConfirm: true,
		action() {
			team.removeSupplier( supplier );
		}
	}
}

export {
	createTeam,
	editTeam,
	viewTeam,
	deleteTeam,
	removeSupplier
}
