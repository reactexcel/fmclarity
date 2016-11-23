import React from 'react';

import { Action } from '/modules/core/Actions';
import { Modal } from '/modules/ui/Modal';

const create = new Action( {
	name: 'create member',
	label: "Create member",
	type: [ 'team', 'user' ],
	action: ( group, member, addPersonnel, team ) => {
		import { UserPanel, UserViewEdit } from '/modules/models/Users';
		Modal.show( {
			content: <UserViewEdit group = { group } team = { team } addPersonnel = { addPersonnel }/>
		} )
	}
} )

const edit = new Action( {
	name: 'edit member',
	label: "Edit member",
	type: [ 'team', 'user' ],
	action: ( group, member, onUpdate ) => {
		import { UserPanel, UserViewEdit } from '/modules/models/Users';
		Modal.show( {
			content: <UserViewEdit item = { member } group = { group } onUpdate = { onUpdate }/>
		} )
	}
} )

const invite = new Action( {
	name: 'invite member',
	label: "Invite member",
	type: [ 'team', 'user' ],
	action: ( group, member, onUpdate ) => {
		import { UserPanel, UserViewEdit } from '/modules/models/Users';
		import { Teams } from '/modules/models/Teams';
		if ( Teams.findOne( { _id: group._id} ) ) {
			group.sendMemberInvite( member );
			window.alert("Invitation has been sent to \""+ member.getName() + "\"");
		}
	}
} )

const view = new Action( {
	name: 'view member',
	label: "View member",
	type: [ 'team', 'user' ],
	action: ( group, member ) => {
		import { UserPanel, UserViewEdit } from '/modules/models/Users';
		Modal.show( {
			content: <UserPanel item = { member } group = { group }/>
		} )
	}
} )

const remove = new Action( {
	name: 'remove member',
	label: "Remove member",
	action: ( group, user ) => {
		if( group && user ) {
			group.removeMember( user );
		}
	}
} )

export {
	create,
	edit,
	invite,
	view,
	remove
}
