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
		if(window.matchMedia("(max-width: 768px)").matches){
			window.location.replace('/requests');
		}
		mount( LayoutMain, {
			content: <PageDashboardContainer />
		} );
	}
} )

Routes.addAccessRule( {
	action: [
		'logout',
	],
	role: [ '*' ],
} )

Routes.addAccessRule( {
	action: [
		'requests',
		'portfolio',
	],
	role: [ '*' ],
	condition: { type:'fm' }
} )

Routes.addAccessRule( {
	action: [
		'sites',
		'clients',
		'jobs'
	],
	role: [ 'manager' ],
	condition: { type:'contractor' }
} )

Routes.addAccessRule( {
	action: [
		'dashboard',
		'suppliers',
		'calendar',
		'account',
		'abc'
	],
	role: [ 'fmc support', 'portfolio manager', 'manager', "caretaker" ],
	condition: { type:'fm' }
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
} )

NavigationDrawerRoutes = Routes.clone( [
	'dashboard',
	'sites',
	'portfolio',
	'suppliers',
	'requests',
	'jobs',
	'calendar',
	'admin',
	'all-facilities',
	'all-files',
	'all-teams',
	'all-users',
	'all-requests'
] );
