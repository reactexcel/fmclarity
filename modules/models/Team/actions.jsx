import React from 'react';

import { Action } from '/modules/core/Action';
import { Modal } from '/modules/ui/Modal';

import { Teams } from '/modules/models/Team';

import TeamStepper from './imports/components/TeamStepper.jsx';
import TeamPanel from './imports/components/TeamPanel.jsx';
import { UserPanel, UserViewEdit } from '/modules/models/UserViews';

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

const removeSupplier = new Action( {
	name: "remove supplier",
	label: "Remove supplier",
	shouldConfirm: true,
	action: ( team, supplier ) => {
		// could put validated action with minimongo logic here???
		team.removeSupplier( supplier );
	}
} )

const createMember = new Action( {
	name: 'create member',
	label: "Create member",
	type: ['team','user'],
	action: ( team, member ) => {
		let user = Users.create( member );
		Modal.show( {
			content: <UserViewEdit item = { user } />
		} )
	}
} )

const editMember = new Action( {
	name: 'edit member',
	label: "Edit member",
	type: ['team','user'],
	action: ( team, member ) => {
		Modal.show( {
			content: <UserViewEdit item = { member } />
		} )
	}
} )

const viewMember = new Action( {
	name: 'view member',
	label: "View member",
	type: ['team','user'],
	action: ( team, member ) => {
		Modal.show( {
			content: <UserPanel item = { member } />
		} )
	}
} )

const destroyMember = new Action( {
	name: 'delete member',
	label: "Delete member",
	type: ['team','user'],
	action: ( team, member ) => {
		//Facilities.destroy( member );
		member.destroy();
	}
} )

const removeMember = new Action( {
	name: 'remove member',
	label: "Delete member",
	type: ['team','user'],
	action: ( team, member ) => {
		team.removeMember( member );
	}
} )

const inviteMember = new Action( {
	name: 'send invite to member',
	label: "Send invite to member",
	type: ['team','user'],
	action: ( team, member ) => {
		team.sendMemberInvite( member )
	}
} )

const resetMemberTours = new Action ({
	name: 'reset tours',
	label: "Reset tours",
	type: ['team','user'],
	action: ( team, member ) => {
		member.resetTours();
	}
})


const loginMember = new Action ({
	name: 'login member',
	label: "Login member",
	type: ['team','user'],
	action: ( team, member ) => {
		member.login();
	}
})


export {
	create,
	edit,
	view,
	destroy,
	removeSupplier,
	createMember,
	editMember,
	viewMember,
	destroyMember,
	removeMember,
	inviteMember,
	resetMemberTours,
	loginMember
}
