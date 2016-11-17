import React from 'react';

import { Action } from '/modules/core/Actions';
import { Modal } from '/modules/ui/Modal';

const create = new Action( {
	name: 'create member',
	label: "Create member",
	type: [ 'team', 'user' ],
	action: ( group, member, addPersonnel ) => {
		import { UserPanel, UserViewEdit } from '/modules/models/Users';
		Modal.show( {
			content: <UserViewEdit addPersonnel = { addPersonnel }/>
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
			content: <UserViewEdit item = { member } group = { group } onUpdate = { onUpdate } />
		} )
	}
} )

const invite = new Action( {
	name: 'invite member',
	label: "Invite member",
	type: [ 'team', 'user' ],
	action: ( group, member, onUpdate ) => {
		import { UserPanel, UserViewEdit } from '/modules/models/Users';
		Modal.show( {
			content: <UserViewEdit item = { member } group = { group } onUpdate = { onUpdate } />
		} )
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
