import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import RequestsPageIndex from '../components/RequestsPageIndex.jsx';
import { Requests } from '/modules/models/Requests';
import { Facilities } from '/modules/models/Facilities';

export default RequestsPageAllContainer = createContainer( ( params ) => {
	Meteor.subscribe( 'Requests' );
	Meteor.subscribe( 'Files' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Facilities' );

	let team = Session.getSelectedTeam,
		facility = Session.getSelectedFacility(),
		requests = Requests.findAll(),
		teamFacilities = null;

	if ( team ) {
		teamFacilities = Facilities.findAll( { 'team._id': team._id } );
	}

	return {
		team,
		facility,
		teamFacilities,
		requests
	}

}, RequestsPageIndex );
