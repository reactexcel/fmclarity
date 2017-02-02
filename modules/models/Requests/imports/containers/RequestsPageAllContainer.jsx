import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import RequestsPageIndex from '../components/RequestsPageIndex.jsx';
import { Requests } from '/modules/models/Requests';
import { Facilities } from '/modules/models/Facilities';

export default RequestsPageAllContainer = createContainer( ( params ) => {

	let team = Session.getSelectedTeam(),
		facility = Session.getSelectedFacility(),
		requests = Requests.findAll(),
		facilities = null;

	if ( team ) {
		facilities = Facilities.findAll( { 'team._id': team._id } );
		let thumbs = _.pluck( facilities, 'thumb');
		Meteor.subscribe( 'Thumbs', thumbs );
	}

	return {
		team,
		facility,
		facilities,
		requests
	}

}, RequestsPageIndex );
