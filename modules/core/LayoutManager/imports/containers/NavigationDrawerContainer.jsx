import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { NavigationDrawer } from '/modules/ui/MaterialNavigation';
import { Routes } from '/modules/core/Action';

export default NavigationDrawerContainer = createContainer( ( { params } ) => {
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Facilities' );

	let user = Meteor.user(),
		team = Session.getSelectedTeam(),
		role = null;

	if( user && team ) {
		role = user.getRole( team );
	}

	return { user, team, userRole: role, routes:Routes }
}, NavigationDrawer );
