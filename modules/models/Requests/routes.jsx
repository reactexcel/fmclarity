import React from 'react';
import { mount } from 'react-mounter';

import { Route } from '/modules/core/Action';
import { Routes } from '/modules/core/Authentication';
import { MainLayout, BlankLayout } from '/modules/core/LayoutManager';

import RequestsPageSingle from './imports/components/RequestsPageSingle.jsx';
import RequestsPageAllContainer from './imports/containers/RequestsPageAllContainer.jsx';
import RequestsPageIndexContainer from './imports/containers/RequestsPageIndexContainer.jsx';

Routes.loggedIn.add( {
	name: 'all-requests',
	path: '/all-requests',
	action() {
		mount( MainLayout, {
			content: <RequestsPageAllContainer />
		} );
	}
} );

const RequestsIndexRoute = new Route( {
	name: 'requests',
	path: '/requests',
	action() {
		mount( MainLayout, {
			content: <RequestsPageIndexContainer />
		} );
	}
} );

const RequestRoute = new Route( {
	name: 'request',
	path: '/requests/:_id',
	action( params ) {
		mount( MainLayout, {
			content: <RequestsPageSingle selected={params._id} />
		} );
	}
} );

export {
	RequestsIndexRoute,
	RequestRoute
}
