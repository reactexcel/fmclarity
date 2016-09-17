import React from 'react';
import { mount } from 'react-mounter';

import { Route } from '/modules/core/Action';
import { Routes } from '/modules/core/Authentication';
import { MainLayout, WideLayout } from '/modules/core/LayoutManager';

import FacilitiesPageIndexContainer from './imports/containers/FacilitiesPageIndexContainer.jsx';
import FacilitiesPageAllContainer from './imports/containers/FacilitiesPageAllContainer.jsx';

Routes.loggedIn.add( {
	name: 'all-facilities',
	path: '/all-facilities',
	action() {
		mount( MainLayout, {
			content: <FacilitiesPageAllContainer />
		} )
	}
} );

const PortfolioRoute = new Route( {
	name: 'portfolio',
	path: '/portfolio',
	action() {
		mount( MainLayout, {
			content: <FacilityPageIndexContainer />
		} );
	}
} );

export {
	PortfolioRoute
}

/*

let loggedIn = new RouteGroup({
	name:'loggedIn',
	onEnter:() => {
		// triggersEnter function 
	}
});

let portfolio = new Route({
	name:'portfolio',
	path:'/portfolio',
	action:() => {
		mount( MainLayout, {
			content: <FacilityPageIndexContainer />
		})
	}
});

loggedIn.add( portfolio );

import { DashboardRoute } from '/modules/plugins/Reports';
import { PortfolioRoute } from '/modules/models/Facility';
import { SuppliersRoute } from '/modules/models/Team';
import { RequestsRoute } from '/modules/models/Request';
import { CalendarRoute } from '/modules/ui/Calendar';
import { ComplianceRoute } from '/modules/plugins/Compliance';

let navMenu = new RouteGroup({
	name:'navMenu'
} );

let team = Session.getSelectedTeam();

if( team.type == 'fm' ) {
	navMenu.add( [
		DashboardRoute,
		PortfolioRoute,
		SuppliersRoute,
		RequestsRoute,
		CalendarRoute,
		ComplianceRoute
	] )
}
else if( team.type == 'contractor' ) {
	navMenu.add( [
		PortfolioRoute,
		RequestsRoute,
		CalendarRoute,
	] )
}


let createRequest = new Action({
	name:'createRequest',
	label:'Create request',
	action() {
	
	}
})

*/
