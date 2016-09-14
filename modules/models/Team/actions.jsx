import React from 'react';

import { Action } from '/both/modules/Action';
import { Modal } from '/both/modules/Modal';

import { Teams } from '/modules/models/Team';

import TeamStepper from './imports/components/TeamStepper.jsx';
import TeamPanel from './imports/components/TeamPanel.jsx';

const create = new Action( {
	label: "Create team",
	run: ( template ) => {
		let team = Teams.create( template );
		Modal.show( {
			content: <TeamStepper item = { team } />
		} )
	}
} )

const edit = new Action( {
	label: "Edit team",
	run: ( teams ) => {
		Modal.show( {
			content: <TeamStepper item = { team } />
		} )
	}
} )

const view = new Action( {
	label: "View teams",
	run: ( team ) => {
		Modal.show( {
			content: <TeamPanel item = { team } />
		} )
	}
} )

const destroy = new Action( {
	label: "Delete teams",
	run: ( team ) => {
		//Facilities.destroy( teams );
		teams.destroy();
	}
} )

const checkRoles = new Action( {
	label: "Check roles",
	run: ( team ) => {
		console.log( Teams.getRoles( team ) );
	}
} )

const removeSupplier = new Action( {
	label: "Remove supplier",
	shouldConfirm: true,
	run: ( team, supplier ) => {
		// could put validated action with minimongo logic here???
		team.removeSupplier( supplier );
	}
} )

export {
	create,
	edit,
	view,
	destroy,
	checkRoles,
	removeSupplier
}
