import React from 'react';

import { Action } from '/modules/core/Action';
import { Modal } from '/both/modules/Modal';

import { Teams } from '/modules/models/Team';

import TeamStepper from './imports/components/TeamStepper.jsx';
import TeamPanel from './imports/components/TeamPanel.jsx';

const create = new Action( {
	name: 'create team',
	label: "Create team",
	action: ( template ) => {
		let team = Teams.create( template );
		Modal.show( {
			content: <TeamStepper item = { team } />
		} )
	}
} )

const edit = new Action( {
	name: 'edit team',
	label: "Edit team",
	action: ( team ) => {
		let { roles, actors } = Teams.getRoles( team );
		console.log( Teams.getRoles( team ) );
		Modal.show( {
			content: <TeamStepper item = { team } />
		} )
	}
} )

const view = new Action( {
	name: 'view team',
	label: "View team",
	action: ( team ) => {
		Modal.show( {
			content: <TeamPanel item = { team } />
		} )
	}
} )

const destroy = new Action( {
	name: 'delete team',
	label: "Delete team",
	action: ( team ) => {
		//Facilities.destroy( team );
		team.destroy();
	}
} )

const checkRoles = new Action( {
	name: 'check team roles',
	label: "Check roles",
	action: ( team ) => {
		if( !team ) {
			throw new Meteor.Error('Action - check team roles: team required');
		}
		console.log( Teams.getRoles( team ) );
	}
} )

const removeSupplier = new Action( {
	name: "remove supplier",
	label: "Remove supplier",
	shouldConfirm: true,
	action: ( team, supplier ) => {
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
