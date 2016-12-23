import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import RequestsPageIndex from '../components/RequestsPageIndex.jsx';
import { Facilities } from '/modules/models/Facilities';
import { Requests } from '/modules/models/Requests';

export default RequestsPageCompleteContainer = createContainer( ( { selectedRequestId } ) => {

	let facility = Session.getSelectedFacility(),
		team = Session.getSelectedTeam(),
		user = Meteor.user(),
		requests = null,
		facilities = null,
    contextFilter = {},
		selectedRequest = null;

    if (user && team) {
      requests = Meteor.apply( "Issues.getCompleteRequest", [team, user], { returnStubValue: true } )
    }


	if ( selectedRequestId ) {
		selectedRequest = Requests.findOne( selectedRequestId );
	}

	if ( team ) {
		facilities = team.getFacilities();
		if ( facilities ) {
			let facilityThumbs = _.pluck( facilities, 'thumb' );
			Meteor.subscribe( 'Thumbs', facilityThumbs );
		}
	}

	if ( facility && facility._id ) {
		contextFilter[ 'facility._id' ] = facility._id;
	} else if ( team && team._id ) {
		//contextFilter[ 'team._id' ] = team._id;
	}


	return {
		team,
		facilities,
		facility,
		requests,
		selectedRequest,
		contextFilter,
		user,
	}
}, RequestsPageIndex );
