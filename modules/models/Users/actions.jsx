/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';

import { Action } from '/modules/core/Actions';
import { Modal } from '/modules/ui/Modal';

import { Users } from '/modules/models/Users';

import { LoginService } from '/modules/core/Authentication';


// okay, so these actions should actually be part of team and/or facility
//  then we can accurately evaluate the roles of the accessor within that context


// I think there needs to be member actions and these two group oriented actions should go there
const edit = new Action( {
	name: 'edit user',
	label: "Edit user",
	type: [ 'user' ],
	action: ( { user, group } ) => {
		Modal.show( {
			// could MemberViewEdit be better for this
			//  or rather - maybe we need a component in members what render UserViewEdit but adds the group role field
			content: <UserViewEdit item = { user } group = { group }/>
		} )
	}
} )

const remove = new Action( {
	name: 'remove user',
	label: "Remove user",
	action: ( { user, group } ) => {
		if( group && user ) {
			group.removeMember( user );
		}
	}
} )

const login = new Action( {
	name: 'login as user',
	label: 'Login as user',
	type: [ 'user' ],
	action: ( user ) => {
		LoginService.loginUser( user, () => {
			location.reload();
		} )
	}
} )


export {
	edit,
	remove,
	login
/*	create,
	edit,
	view,
	destroy,
	remove,
	invite,
	resetTours,
	login*/
}