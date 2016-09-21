import React from 'react';
import { mount } from 'react-mounter';

import { AccessGroups } from '/modules/core/Authentication';
import { DashboardPageContainer } from '/modules/features/Reports';
import { MainLayout } from '/modules/core/Layouts';

AccessGroups.loggedIn.add( {
	name: 'root',
	path: '/',
	action() {
		mount( MainLayout, {
			content: <DashboardPageContainer />
		} );
	}
} )