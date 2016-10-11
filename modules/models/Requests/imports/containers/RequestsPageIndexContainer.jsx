import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import RequestsPageIndex from '../components/RequestsPageIndex.jsx';
import { Facilities } from '/modules/models/Facilities';
import { Requests } from '/modules/models/Requests';

export default RequestsPageIndexContainer = createContainer( ( params ) => {
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Requests' );
	Meteor.subscribe( 'Documents' );
	Meteor.subscribe( 'Files' );

	let facility = Session.getSelectedFacility(),
		team = Session.getSelectedTeam(),
		user = Meteor.user(),
		requests = null,
		facilities = null,
		statusFilter = { "status": { $nin: [ "Cancelled", "Deleted", "Closed", "Reversed" ] } },
		contextFilter = {};

	if ( team ) {
		Meteor.subscribe( 'Facilities', { team } );
		facilities = Facilities.findAll( { 'team._id': team._id } );
		let thumbs = _.pluck( facilities, 'thumb');
		Meteor.subscribe( 'Thumbs', thumbs );
	}

	if ( facility && facility._id ) {
		if( facility.suppliers ) {
			Meteor.subscribe( 'Suppliers', facility.suppliers );
		}
		contextFilter[ 'facility._id' ] = facility._id;
	} else if ( team && team._id ) {
		contextFilter[ 'team._id' ] = team._id;
	}

	if ( user != null ) {
		// Requests.findForUser( Meteor.user() )...???
		requests = user.getRequests( { $and: [ statusFilter, contextFilter ] }, { expandPMP: true } );
		Meteor.subscribe( 'Suppliers', _.pluck( requests, 'supplier' ) );
		//console.log( requests );
	}

	return {
		team,
		facilities,
		facility,
		requests
	}
}, RequestsPageIndex );
