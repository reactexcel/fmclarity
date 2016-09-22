import React from 'react';
import { mount } from 'react-mounter';

import { AccessGroups } from '/modules/core/Authentication';
import { LayoutMain, LayoutBlank } 	from '/modules/core/Layouts';

import MessagesPage from './imports/containers/MessagesPageContainer.jsx';

AccessGroups.loggedIn.add( {
	name: 'all-messages',
	path: '/all-messages',
	action() {
		mount( LayoutMain, {
			content: <MessagesPageContainer />
		} );
	}
} );
