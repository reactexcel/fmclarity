import React from 'react';
import { mount } from 'react-mounter';

import { Route } from '/modules/core/Actions';
import { AccessGroups } from '/modules/core/Authentication';
import { LayoutMain, LayoutWide } from '/modules/core/Layouts';

import FacilitiesPageIndexContainer from './imports/containers/FacilitiesPageIndexContainer.jsx';
import FacilitiesPageAllContainer from './imports/containers/FacilitiesPageAllContainer.jsx';

AccessGroups.loggedIn.add( {
	name: 'all-facilities',
	path: '/all-facilities',
	label: "All facilities",
	icon: "fa fa-building-o",
	action() {
		mount( LayoutMain, {
			content: <FacilitiesPageAllContainer />
		} )
	}
} );

AccessGroups.loggedIn.add( {
	name: 'portfolio',
	path: '/portfolio',
	label: "Porffolio",
	icon: 'fa fa-building',
	action() {
		mount( LayoutMain, {
			content: <FacilitiesPageIndexContainer />
		} );
	}
} );

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
		mount( LayoutMain, {
			content: <FacilityPageIndexContainer />
		})
	}
});

loggedIn.add( portfolio );

import { DashboardRoute } from '/modules/features/Reports';
import { PortfolioRoute } from '/modules/models/Facilities';
import { SuppliersRoute } from '/modules/models/Teams';
import { RequestsRoute } from '/modules/models/Requests';
import { CalendarRoute } from '/modules/ui/Calendar';
import { ComplianceRoute } from '/modules/features/Compliance';

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
