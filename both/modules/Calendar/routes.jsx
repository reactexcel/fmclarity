import React from 'react';
import { mount } from 'react-mounter';

import { Action } from '/modules/core/Action';
import { MainLayout, BlankLayout } from '/modules/core/LayoutManager';

import CalendarPage from './imports/components/CalendarPage.jsx';

const CalendarRoute = new Action( {
	name: 'calendar',
	path: '/calendar',
	action() {
		mount( MainLayout, {
			content: <CalendarPage/>
		} );
	}
} );

export {
	CalendarRoute
}
