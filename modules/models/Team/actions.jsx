import React from 'react';

import { Action } from '/both/modules/Action';
import { Modal } from '/both/modules/Modal';

import { Teams } from '/modules/models/Team';

import TeamStepper from './imports/components/TeamStepper.jsx';
import TeamPanel from './imports/components/TeamPanel.jsx';

const create = new Action( {
	name: 'create team',
	label: "Create team",
	run: ( template ) => {
		let team = Teams.create( template );
		Modal.show( {
			content: <TeamStepper item = { team } />
		} )
	}
} )

const edit = new Action( {
	name: 'edit team',
	label: "Edit team",
	run: ( team ) => {
		let { roles, actors } = Teams.getRoles( team );
		console.log( Teams.getRoles( team ) );
		Modal.show( {
			content: <TeamStepper item = { team } />
		} )
	}
} )

const view = new Action( {
	name: 'view teams',
	label: "View teams",
	run: ( team ) => {
		Modal.show( {
			content: <TeamPanel item = { team } />
		} )
	}
} )

const destroy = new Action( {
	name: 'delete team',
	label: "Delete team",
	run: ( team ) => {
		//Facilities.destroy( teams );
		team.destroy();
	}
} )

const checkRoles = new Action( {
	name: 'check team roles',
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
