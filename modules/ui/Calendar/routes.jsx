import React from 'react';
import { mount } from 'react-mounter';

import { Route } from '/modules/core/Actions';
import { AccessGroups } from '/modules/core/Authentication';
import { LayoutMain, LayoutBlank } from '/modules/core/Layouts';

import CalendarPage from './imports/components/CalendarPage.jsx';

AccessGroups.loggedIn.add( {
	name: 'calendar',
	path: '/calendar',
	label: "Calendar",
	icon: 'fa fa-calendar',
	action() {
		mount( LayoutMain, {
			content: <CalendarPage/>
		} );
	}
} );

export {
	CalendarRoute
}
