import React from 'react';

import { Action } from '/modules/core/Actions';
import { Modal } from '/modules/ui/Modal';
import { UserPanel, UserViewEdit } from '/modules/models/Users';


const createMember = new Action( {
	name: 'create member',
	label: "Create member",
	type: [ 'team', 'user' ],
	action: ( group, member, addPersonnel ) => {
		Modal.show( {
			content: <UserViewEdit addPersonnel = { addPersonnel }/>
		} )
	}
} )

const editMember = new Action( {
	name: 'edit team member',
	label: "Edit member",
	type: [ 'team', 'user' ],
	action: ( group, member ) => {
		Modal.show( {
			content: <UserViewEdit item = { member } />
		} )
	}
} )

const viewMember = new Action( {
	name: 'view team member',
	label: "View member",
	type: [ 'team', 'user' ],
	action: ( group, member ) => {
		Modal.show( {
			content: <UserPanel item = { member } />
		} )
	}
} )


export {

	createMember,
	viewMember,
	editMember,

}
