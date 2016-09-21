import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/modules/core/Layouts';

import TeamPageProfileContainer from './imports/containers/TeamPageProfileContainer.jsx';
import TeamPageSuppliersContainer from './imports/containers/TeamPageSuppliersContainer.jsx';
import TeamsPageIndexContainer from './imports/containers/TeamsPageIndexContainer.jsx';

import { Route } from '/modules/core/Actions';
import { AccessGroups } from '/modules/core/Authentication';

AccessGroups.loggedIn.add( {
	name: 'all-teams',
	path: '/all-teams',
	label: "All teams",
	icon: "fa fa-group",
	action() {
		mount( MainLayout, {
			content: <TeamsPageIndexContainer />
		})
	}
} );

AccessGroups.loggedIn.add( {
	name: 'suppliers',
	path: '/suppliers',
	label: "Suppliers",
	icon: 'fa fa-group',
	action() {
		mount( MainLayout, {
			content: <TeamPageSuppliersContainer />
		} );
	}
} );

AccessGroups.loggedIn.add( {
	name: 'account',
	path: '/account',
	action() {
		mount( MainLayout, {
			content: <TeamPageProfileContainer />
		} );
	}
} );
