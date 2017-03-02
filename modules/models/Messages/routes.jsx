import React from 'react';
import { mount } from 'react-mounter';

import { AccessGroups } from '/modules/core/Authentication';
import { LayoutMain, LayoutBlank } 	from '/modules/core/Layouts';

import MessagesPage from './imports/containers/MessagesPageContainer.jsx';
import NotificationsPageContainer from './imports/containers/NotificationsPageContainer.jsx';


AccessGroups.loggedIn.add( {
	name: 'all-messages',
	path: '/all-messages',
	action() {
		mount( LayoutMain, {
			content: <MessagesPageContainer />
		} );
	}
} );


AccessGroups.loggedIn.add( {
	name: 'notifications',
	path: '/notifications',
	label: 'Notifications',
	action() {
		mount( LayoutMain, {
			content: <NotificationsPageContainer />
		} );
	}
} );
