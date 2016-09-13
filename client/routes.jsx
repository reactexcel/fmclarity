import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout } from '/both/modules/LayoutManager';
import { Routes } from '/both/modules/Authentication';

Routes.loggedIn.route( '/', {
	name: 'root',
	action() {
		mount( MainLayout, {
			content: <LandingPage/>
		} );
	}
} )