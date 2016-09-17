import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import DashboardPage from '../components/DashboardPage.jsx';

export default DashboardPageContainer = createContainer( ( params ) => {
	// this is dud - they should be saved in global state
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Files' );
	return {
		team: Session.getSelectedTeam(),
		facility: Session.getSelectedFacility()
	}
}, DashboardPage );