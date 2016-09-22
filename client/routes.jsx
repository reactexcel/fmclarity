import React from 'react';
import { mount } from 'react-mounter';

import { AccessGroups } from '/modules/core/Authentication';
import { Routes } from '/modules/core/Actions';
import { PageDashboardContainer } from '/modules/features/Reports';
import { MainLayout } from '/modules/core/Layouts';

AccessGroups.loggedIn.add( {
	name: 'root',
	path: '/',
	action() {
		mount( MainLayout, {
			content: <PageDashboardContainer />
		} );
	}
} )

Routes.addAccessRule( {
	action: [ 
		'dashboard', 
		'portfolio', 
		'suppliers', 
		'requests', 
		'calendar', 
		'abc' 
	],
	role: [ 'portfolio manager', 'manager' ],
	rule: { alert: true }
} )

Routes.addAccessRule( {
	action: [ 
		'admin', 
		'account', 
		'logout',
		'all-facilities',
		'all-files',
		'all-teams',
		'all-users',
		'all-requests'
	],
	role: [ 'portfolio manager', 'manager' ],
	rule: { alert: true }
} )
