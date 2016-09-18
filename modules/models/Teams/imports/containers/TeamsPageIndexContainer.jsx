import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Teams } from '/modules/models';

import TeamsPageIndex from '../components/TeamsPageIndex.jsx';

export default TeamsPageIndexContainer = createContainer( ( params ) => {
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Files' );
	return {
		teams: Teams.findAll()
	}
}, TeamsPageIndex );
