import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import RequestsPageIndex from '../components/RequestsPageIndex.jsx';

export default RequestsPageAllContainer = createContainer( ( params ) => {
	Meteor.subscribe( 'Requests' );
	Meteor.subscribe( 'Files' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Facilities' );
	return {
		team: Session.getSelectedTeam(),
		facility: Session.getSelectedFacility(),
		requests: Issues.findAll()
	}

}, RequestsPageIndex );
