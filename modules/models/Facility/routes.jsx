import React from 'react';
import { mount } from 'react-mounter';

import { Action } from '/modules/core/Action';
import { Routes } from '/modules/core/Authentication';
import { MainLayout, WideLayout } from '/modules/core/LayoutManager';

import FacilitiesPageIndexContainer from './imports/containers/FacilitiesPageIndexContainer.jsx';
import FacilitiesPageAllContainer from './imports/containers/FacilitiesPageAllContainer.jsx';

Routes.loggedIn.add( {
	name: 'facilities-all',
	path: '/facilities-all',
	action() {
		mount( MainLayout, {
			content: <FacilitiesPageAllContainer />
		} )
	}
} );

const PortfolioRoute = new Action( {
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

import { DashboardRoute } from '/both/modules/Reports';
import { PortfolioRoute } from '/modules/models/Facility';
import { SuppliersRoute } from '/modules/models/Team';
import { RequestsRoute } from '/modules/models/Request';
import { CalendarRoute } from '/both/modules/Calendar';
import { ComplianceRoute } from '/both/modules/Compliance';

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
