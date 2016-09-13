import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout } from '/both/modules/LayoutManager';
import { Routes } from '/both/modules/Authentication';

import { DashboardRoute } from '/both/modules/Reports';
import { PortfolioRoute } from '/modules/models/Facility';
import { SuppliersIndexRoute } from '/modules/models/Team';
import { RequestsIndexRoute } from '/modules/models/Request';
import { CalendarRoute } from '/both/modules/Calendar';
import { ComplianceIndexRoute } from '/both/modules/Compliance';




Routes.loggedIn.add( [
	DashboardRoute,
	PortfolioRoute,
	SuppliersIndexRoute,
	RequestsIndexRoute,
	CalendarRoute,
	ComplianceIndexRoute
] );

Routes.loggedIn.add( {
	name: 'root',
	path: '/',
	action() {
		mount( MainLayout, {
			content: <LandingPage/>
		} );
	}
} )