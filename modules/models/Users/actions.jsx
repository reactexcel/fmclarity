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

const edit = new Action( {
	name: 'edit user',
	label: "Edit user",
	type: [ 'user' ],
	action: ( user ) => {
		Modal.show( {
			content: <UserViewEdit item = { user } />
		} )
	}
} )

const login = new Action( {
	name: 'login as user',
	label: 'Login as user',
	type: [ 'user' ],
	action: ( user ) => {
		LoginService.loginUser( user, () => {
			console.log( 'I did it' );
		} )
	}
} )


export {
	edit,
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