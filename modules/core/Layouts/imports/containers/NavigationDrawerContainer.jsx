/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
 
import React 					from 'react';
import { createContainer } 		from 'meteor/react-meteor-data';
import { NavigationDrawer } 	from '/modules/ui/MaterialNavigation';
import { Routes } 				from '/modules/core/Actions';

/**
 * @class 			NavigationDrawerContainer
 * @memberOf 		module:core/Layouts
 */
const NavigationDrawerContainer = createContainer( ( { params } ) => {
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Facilities' );

	let user = Meteor.user(),
		team = Session.getSelectedTeam(),
		role = null;

	if ( user && team ) {
		role = user.getRole( team );
	}

	return { user, team, userRole: role, routes: Routes }
}, NavigationDrawer );

export default NavigationDrawerContainer;
