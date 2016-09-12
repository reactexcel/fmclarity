import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout } from '/both/modules/LayoutManager';
import { loggedIn } from '/both/modules/Authentication';

loggedIn.route( '/', {
	name: 'root',
	action() {
		mount( MainLayout, {
			content: <LandingPage/>
		} );
	}
} )