import React from 'react';
import { mount } from 'react-mounter';

import { Routes } from '/both/modules/Authentication';
import { MainLayout, BlankLayout } 	from '/both/modules/LayoutManager';

import MessagesPage from './imports/components/MessagesPage.jsx';

Routes.loggedIn.route( '/messages', {
	name: 'messages',
	action() {
		mount( MainLayout, {
			content: <MessagesPage />
		} );
	}
} );
