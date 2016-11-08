import React from 'react';
import { mount } from 'react-mounter';

import { Route } from '/modules/core/Actions';
import { AccessGroups } from '/modules/core/Authentication';
import { LayoutMain, LayoutBlank } from '/modules/core/Layouts';

import RequestsPageSingle from './imports/components/RequestsPageSingle.jsx';
import RequestsPageAllContainer from './imports/containers/RequestsPageAllContainer.jsx';
import RequestsPageIndexContainer from './imports/containers/RequestsPageIndexContainer.jsx';

AccessGroups.loggedIn.add( {
	name: 'all-requests',
	path: '/all-requests',
	label: "All requests",
	icon: 'fa fa-cubes',
	action() {
		mount( LayoutMain, {
			content: <RequestsPageAllContainer />
		} );
	}
} );

AccessGroups.loggedIn.add( {
	name: 'requests',
	path: '/requests',
	label: "Jobs",
	icon: 'fa fa-wrench',
	action() {
		mount( LayoutMain, {
			content: <RequestsPageIndexContainer />
		} );
	}
} );

AccessGroups.loggedIn.add( {
	name: 'request',
	path: '/requests/:_id',
	action( params ) {
		mount( LayoutMain, {
			content: <RequestsPageIndexContainer selectedRequestId = { params._id } />
		} );
	}
} );
