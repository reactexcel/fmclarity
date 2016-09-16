import React from 'react';
import { mount } from 'react-mounter';

import { Routes } from '/modules/core/Authentication';
import { MainLayout, BlankLayout } 	from '/modules/core/LayoutManager';

import MessagesPage from './imports/containers/MessagesPageContainer.jsx';

Routes.loggedIn.add( {
	name: 'all-messages',
	path: '/all-messages',
	action() {
		mount( MainLayout, {
			content: <MessagesPageContainer />
		} );
	}
} );
