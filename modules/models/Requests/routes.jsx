import React from 'react';
import { mount } from 'react-mounter';

import { Route } from '/modules/core/Actions';
import { AccessGroups } from '/modules/core/Authentication';
import { MainLayout, BlankLayout } from '/modules/core/Layouts';

import RequestsPageSingle from './imports/components/RequestsPageSingle.jsx';
import RequestsPageAllContainer from './imports/containers/RequestsPageAllContainer.jsx';
import RequestsPageIndexContainer from './imports/containers/RequestsPageIndexContainer.jsx';

AccessGroups.loggedIn.add( {
	name: 'all-requests',
	path: '/all-requests',
	action() {
		mount( MainLayout, {
			content: <RequestsPageAllContainer />
		} );
	}
} );

AccessGroups.loggedIn.add( {
	name: 'requests',
	path: '/requests',
	label: "Requests",
	icon: 'fa fa-wrench',
	action() {
		mount( MainLayout, {
			content: <RequestsPageIndexContainer />
		} );
	}
} );

AccessGroups.loggedIn.add( {
	name: 'request',
	path: '/requests/:_id',
	action( params ) {
		mount( MainLayout, {
			content: <RequestsPageSingle selected={params._id} />
		} );
	}
} );
