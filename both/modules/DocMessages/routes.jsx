import React from 'react';
import { mount } from 'react-mounter';

import { loggedIn } from '/both/modules/Authentication';
import { MainLayout, BlankLayout } 	from '/both/modules/LayoutManager';

import MessagesPage from './imports/components/MessagesPage.jsx';

loggedIn.route( '/messages', {
	name: 'messages',
	action() {
		mount( MainLayout, {
			content: <MessagesPage />
		} );
	}
} );
