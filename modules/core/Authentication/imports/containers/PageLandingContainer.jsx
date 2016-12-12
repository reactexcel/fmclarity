/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import { Routes } from '/modules/core/Actions';
import PageLanding from '../components/PageLanding.jsx';

/**
 * @class 			PageLandingContainer
 * @memberOf 		module:core/Authentication
 */
const PageLandingContainer = createContainer( ( { params } ) => {

	let user = Meteor.user(),
		team = Session.getSelectedTeam();

	if( !user || ! team ) {
		return {};
	}

	let routeNames = Object.keys( NavigationDrawerRoutes.actions ),
		validRoutes = Routes.filter( routeNames, team );
		validRouteNames = Object.keys( validRoutes );

	//console.log( validRouteNames );

	if( validRouteNames && validRouteNames[0] ) {
		Routes.run(validRouteNames[0]);
	}

	return {
		route: validRoutes[0]
	}

}, PageLanding );

export default PageLandingContainer;
