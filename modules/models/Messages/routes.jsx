import React from 'react';
import { mount } from 'react-mounter';

import { AccessGroups } from '/modules/core/Authentication';
import { MainLayout, BlankLayout } 	from '/modules/core/Layouts';

import MessagesPage from './imports/containers/MessagesPageContainer.jsx';

AccessGroups.loggedIn.add( {
	name: 'all-messages',
	path: '/all-messages',
	action() {
		mount( MainLayout, {
			content: <MessagesPageContainer />
		} );
	}
} );
