import React from 'react';
import { mount } from 'react-mounter';

import { LayoutMain } from '/modules/core/Layouts';
import { AccessGroups } from '/modules/core/Authentication';

import TeamPageProfileContainer from './imports/containers/TeamPageProfileContainer.jsx';
import TeamPageSuppliersContainer from './imports/containers/TeamPageSuppliersContainer.jsx';
import TeamsPageIndexContainer from './imports/containers/TeamsPageIndexContainer.jsx';
import TeamGlobalSupplierPageContainer from './imports/containers/TeamGlobalSupplierPageContainer.jsx';


AccessGroups.loggedIn.add( {
	name: 'all-teams',
	path: '/all-teams',
	label: "All teams",
	icon: "fa fa-group",
	action() {
		mount( LayoutMain, {
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
		mount( LayoutMain, {
			content: <TeamPageSuppliersContainer />
		} );
	}
} );

AccessGroups.loggedIn.add( {
	name: 'global suppliers',
	path: '/global-suppliers',
	label: "Global Suppliers",
	icon: 'fa fa-group',
	action() {
		mount( LayoutMain, {
			content: <TeamGlobalSupplierPageContainer />
		} );
	}
} );

AccessGroups.loggedIn.add( {
	name: 'account',
	path: '/account',
	label: 'Account',
	icon: 'fa fa-cog',
	action() {
		mount( LayoutMain, {
			content: <TeamPageProfileContainer />
		} );
	}
} );
