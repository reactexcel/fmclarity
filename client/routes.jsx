import React from 'react';
import { mount } from 'react-mounter';

import { Routes } from '/both/modules/Authentication';
import { MainLayout } from '/both/modules/LayoutManager';

import { PortfolioRoute } from '/modules/models/Facility';
import { TeamRoutes } from '/modules/models/Team';
import { RequestsIndexRoute } from '/modules/models/Request';

import { CalendarRoute } from '/both/modules/Calendar';
import { ComplianceIndexRoute } from '/both/modules/Compliance';
import { DashboardRoute } from '/both/modules/Reports';


console.log( TeamRoutes );

// TODO: Differentiate for different team types
//  link this to navdrawer
//  create similar setup for actions and and FAB
Routes.loggedIn.add( [
	DashboardRoute,
	PortfolioRoute,
	TeamRoutes.SuppliersIndex,
	TeamRoutes.AccountProfile,
	RequestsIndexRoute,
	CalendarRoute,
	ComplianceIndexRoute
] );

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