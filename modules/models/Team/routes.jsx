import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/both/modules/LayoutManager';

import TeamPageProfileContainer from './imports/containers/TeamPageProfileContainer.jsx';
import TeamPageSuppliersContainer from './imports/containers/TeamPageSuppliersContainer.jsx';
import TeamsPageIndexContainer from './imports/containers/TeamsPageIndexContainer.jsx';

import { Action } from '/both/modules/Action';
import { Routes } from '/both/modules/Authentication';

Routes.loggedIn.add( {
	name: 'teams',
	path: '/teams',
	action() {
		mount( MainLayout, {
			content: <TeamsPageIndexContainer />
		})
	}
} );

const SuppliersIndexRoute = new Action( {
	name: 'suppliers',
	path: '/suppliers',
	action() {
		mount( MainLayout, {
			content: <TeamPageSuppliersContainer />
		} );
	}
} );

const AccountProfileRoute = new Action( {
	name: 'account',
	path: '/account',
	action() {
		mount( MainLayout, {
			content: <TeamPageProfileContainer />
		} );
	}
} );

export {
	SuppliersIndexRoute,
	AccountProfileRoute
}
