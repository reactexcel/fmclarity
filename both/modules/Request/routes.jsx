import React from 'react';
import { mount } from 'react-mounter';

import { loggedIn } from '/both/modules/Authentication';
import { MainLayout, BlankLayout } 	from '/both/modules/LayoutManager';

import RequestsPageIndexContainer from './imports/containers/RequestsPageIndexContainer.jsx';
import RequestsPageSingle from './imports/components/RequestsPageSingle.jsx';

loggedIn.route( '/requests', {
	name: 'requests',
	action() {
		mount( MainLayout, {
			content: <RequestsPageIndexContainer />
		} );
	}
} )

loggedIn.route( '/requests/:_id', {
	name: 'request',
	action( params ) {
		mount( MainLayout, {
			content: <RequestsPageSingle selected={params._id} />
		} );
	}
} )
