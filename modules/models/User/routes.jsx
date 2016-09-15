import React from 'react';
import { mount } from 'react-mounter';

import { Routes } from '/modules/core/Authentication';
import { MainLayout, WideLayout } from '/modules/core/LayoutManager';

import UserPageProfileContainer from './imports/containers/UserPageProfileContainer.jsx';
import UsersPageIndexContainer from './imports/containers/UsersPageIndexContainer.jsx';

Routes.loggedIn.add( {
	name: 'profile',
	path: '/profile',
	action() {
		mount( MainLayout, {
			content: <UserPageProfileContainer />
		} );
	}
} );

Routes.loggedIn.add( { 
	name: 'users',
	path: '/users',
	action() {
		mount( MainLayout, {
			content: <UsersPageIndexContainer />
		} );
	}
} );
