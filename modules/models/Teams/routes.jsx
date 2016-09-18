import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/modules/core/LayoutManager';

import TeamPageProfileContainer from './imports/containers/TeamPageProfileContainer.jsx';
import TeamPageSuppliersContainer from './imports/containers/TeamPageSuppliersContainer.jsx';
import TeamsPageIndexContainer from './imports/containers/TeamsPageIndexContainer.jsx';

import { Route } from '/modules/core/Action';
import { Routes } from '/modules/core/Authentication';

Routes.loggedIn.add( {
	name: 'all-teams',
	path: '/all-teams',
	action() {
		mount( MainLayout, {
			content: <TeamsPageIndexContainer />
		})
	}
} );

const SuppliersIndex = new Route( {
	name: 'suppliers',
	path: '/suppliers',
	action() {
		mount( MainLayout, {
			content: <TeamPageSuppliersContainer />
		} );
	}
} );

const AccountProfile = new Route( {
	name: 'account',
	path: '/account',
	action() {
		mount( MainLayout, {
			content: <TeamPageProfileContainer />
		} );
	}
} );

export {
	SuppliersIndex,
	AccountProfile
}
