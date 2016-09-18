import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { FloatingActionButton } from '/modules/ui/MaterialNavigation';

export default FloatingActionButtonContainer = createContainer( ( { params } ) => {
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Messages' );
	Meteor.subscribe( 'Notifications' );
	let actions = null;
	return {
		actions
	}
}, FloatingActionButton );
