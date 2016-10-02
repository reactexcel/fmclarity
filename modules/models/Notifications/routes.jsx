import React from 'react';
import { mount } from 'react-mounter';

import { AccessGroups } from '/modules/core/Authentication';
import { LayoutMain } 	from '/modules/core/Layouts';

import NotificationsPageContainer from './imports/containers/NotificationsPageContainer.jsx';

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
