import React from 'react';
import { mount } from 'react-mounter';

import { AccessGroups } from '/modules/core/Authentication';
import { LayoutMain, LayoutWide } from '/modules/core/Layouts';

import UserPageProfileContainer from './imports/containers/UserPageProfileContainer.jsx';
import UsersPageIndexContainer from './imports/containers/UsersPageIndexContainer.jsx';

AccessGroups.loggedIn.add( {
	name: 'profile',
	path: '/profile',
	action() {
		mount( LayoutMain, {
			content: <UserPageProfileContainer />
		} );
	}
} );

AccessGroups.loggedIn.add( { 
	name: 'all-users',
	path: '/all-users',
	label: "All users",
	icon: 'fa fa-group',
	action() {
		mount( LayoutMain, {
			content: <UsersPageIndexContainer />
		} );
	}
} );
