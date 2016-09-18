import React from 'react';
import { mount } from 'react-mounter';

import { Routes } from '/modules/core/Authentication';
import { MainLayout } from '/modules/core/LayoutManager';

import { PortfolioRoute } from '/modules/models/Facilities';
import { TeamRoutes } from '/modules/models/Teams';
import { RequestsIndexRoute } from '/modules/models/Requests';

import { CalendarRoute } from '/modules/ui/Calendar';
import { ComplianceIndexRoute } from '/modules/plugins/Compliance';
import { DashboardRoute } from '/modules/plugins/Reports';


console.log( TeamRoutes );

// TODO: Differentiate for different team types
//  link this to navdrawer
//  create similar setup for actions and and FAB
/*
Routes.loggedIn.add( [
	DashboardRoute,
	PortfolioRoute,
	TeamRoutes.SuppliersIndex,
	TeamRoutes.AccountProfile,
	RequestsIndexRoute,
	CalendarRoute,
	ComplianceIndexRoute
] );
*/
// Differentiate home page depending on team type
Routes.loggedIn.add( {
	name: 'root',
	path: '/',
	action() {
		mount( MainLayout, {
			content: <LandingPage/>
		} );
	}
} )