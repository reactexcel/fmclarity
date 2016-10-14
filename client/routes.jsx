import React from 'react';
import { mount } from 'react-mounter';

import { AccessGroups } from '/modules/core/Authentication';
import { Routes } from '/modules/core/Actions';
import { PageDashboardContainer } from '/modules/features/Reports';
import { LayoutMain } from '/modules/core/Layouts';
import { ActionGroup } from '/modules/core/Actions';

AccessGroups.loggedIn.add( {
	name: 'root',
	path: '/',
	action() {
		mount( LayoutMain, {
			content: <PageDashboardContainer />
		} );
	}
} )

Routes.addAccessRule( {
	action: [
		'logout',
		'requests',
		'portfolio',
	],
	role: [ '*' ],
	rule: { alert: true }
} )

Routes.addAccessRule( {
	action: [
		'dashboard',
		'suppliers',
		'calendar',
		'account',
		'abc'
	],
	role: [ 'fmc support', 'portfolio manager', 'manager' ],
	rule: { alert: true }
} )

Routes.addAccessRule( {
	action: [
		'admin',
		'all-facilities',
		'all-files',
		'all-teams',
		'all-users',
		'all-requests'
	],
	role: [ 'fmc support' ],
	rule: { alert: true }
} )

NavigationDrawerRoutes = Routes.clone( [
	'dashboard',
	'portfolio',
	'suppliers',
	'requests',
	'calendar',
	'admin',
	'all-facilities',
	'all-files',
	'all-teams',
	'all-users',
	'all-requests'
] );
