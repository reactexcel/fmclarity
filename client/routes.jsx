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
		'request-print'
	],
	role: [
		'owner',
		'staff',
		'tenant',
		'manager',
		'assignee',
		'resident',
		'caretaker',
		'fmc support',
		'team manager',
		'team caretaker',
		'property manager',
		'team fmc support',
		'facility manager',
		'supplier manager',
		'portfolio manager',
		'supplier fmc support',
		'team portfolio manager',
		'supplier portfolio manager',
 	],
	condition: { type:'fm' }
} )
// Routes.addAccessRule( {
// 	action: [
// 		'requests',
// 		'portfolio',
// 		'request-print'
// 	],
// 	role: [ '*' ],
// 	condition: { type:'fm' }
// } )

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
		'abc',
		'global suppliers',
		'user-docs',
	],
	role: [ 'fmc support', 'portfolio manager', 'manager', 'caretaker' ],
	condition: { type:'fm' }
} )

Routes.addAccessRule( {
	action: [
		'requests',
	],
	role: [ 'support' ],
	condition: { type:'fm' }
} )

Routes.addAccessRule( {
	action: [
		'calendar',
		'request-print',
	],
	role: [ 'support' ]
} )
Routes.addAccessRule( {
	action: [
		'jobs',
	],
	role: [ 'support' ],
	condition: { type:'contractor' }
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
	'abc',
	'global suppliers',
	'user-docs',
	'admin',
	'all-facilities',
	'all-files',
	'all-teams',
	'all-users',
	'all-requests'
] );
