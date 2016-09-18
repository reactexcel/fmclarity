import React from 'react';
import { mount } from 'react-mounter';

import { Route } from '/modules/core/Action';
import { Routes } from '/modules/core/Authentication';
import { MainLayout, BlankLayout } from '/modules/core/LayoutManager';

import CalendarPage from './imports/components/CalendarPage.jsx';

Routes.loggedIn.add( {
	name: 'calendar',
	path: '/calendar',
	label: "Calendar",
	icon: 'fa fa-calendar',
	action() {
		mount( MainLayout, {
			content: <CalendarPage/>
		} );
	}
} );

export {
	CalendarRoute
}
