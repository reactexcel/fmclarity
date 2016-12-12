import React from 'react';
import { mount } from 'react-mounter';

import { LayoutMain } from '/modules/core/Layouts';
import { Routes, ActionGroup } from '/modules/core/Actions';
import { AccessGroups, PageLandingContainer } from '/modules/core/Authentication';

AccessGroups.loggedIn.add( {
	name: 'root',
	path: '/',
	action() {
		if(window.matchMedia("(max-width: 768px)").matches){
			window.location.replace('/requests');
		}
		mount( LayoutMain, {
			content: <PageLandingContainer />
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
	role: [ 'fmc support', 'portfolio manager', 'manager', 'caretaker' ],
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
	'requests',
	'jobs',
	'sites',
	'portfolio',
	'suppliers',
	'calendar',
	'admin',
	'all-facilities',
	'all-files',
	'all-teams',
	'all-users',
	'all-requests'
] );
