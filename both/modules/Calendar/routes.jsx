import React from 'react';
import { mount } from 'react-mounter';

import { Routes } from '/both/modules/Authentication';
import { MainLayout, BlankLayout } 	from '/both/modules/LayoutManager';

import CalendarPage from './imports/components/CalendarPage.jsx';

Routes.loggedIn.route( '/calendar', {
	name: 'calendar',
	action() {
		mount( MainLayout, {
			content: <CalendarPage/>
		} );
	}
} );
