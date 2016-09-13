import React from 'react';
import { mount } from 'react-mounter';

import { Routes } from '/both/modules/Authentication';
import { MainLayout, BlankLayout } 	from '/both/modules/LayoutManager';

import MessagesPage from './imports/containers/MessagesPageContainer.jsx';

Routes.loggedIn.add( {
	name: 'messages',
	path: '/messages',
	action() {
		mount( MainLayout, {
			content: <MessagesPageContainer />
		} );
	}
} );
