import React from 'react';
import { mount } from 'react-mounter';

import { loggedIn } from '/both/modules/Authentication';
import { MainLayout, BlankLayout } 	from '/both/modules/LayoutManager';

import RequestsPageIndexContainer from './imports/containers/RequestsPageIndexContainer.jsx';

loggedIn.route( '/requests', {
	name: 'requests',
	action() {
		mount( MainLayout, {
			content: <RequestsPageIndexContainer />
		} );
	}
} );
