import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import RequestsPageIndex from '../components/RequestsPageIndex.jsx';
import { Facilities } from '/modules/models/Facilities';
import { Requests } from '/modules/models/Requests';

export default RequestsPageIndexContainer = createContainer( ( { selectedRequestId } ) => {

	let facility = Session.getSelectedFacility(),
		team = Session.getSelectedTeam(),
		user = Meteor.user(),
		requests = null,
		facilities = null,
		statusFilter = { "status": { $nin: [ "Cancelled", "Deleted", "Closed", "Reversed", "PMP", "Rejected" ] } },
		contextFilter = {},
		selectedRequest = null;

	if ( selectedRequestId ) {
		selectedRequest = Requests.findOne( selectedRequestId );
	}

	if ( team ) {
		//facilities = Facilities.findAll( { 'team._id': team._id } );
		facilities = team.getFacilities();
	}

	if ( facility && facility._id ) {
		contextFilter[ 'facility._id' ] = facility._id;
	} else if ( team && team._id ) {
		//contextFilter[ 'team._id' ] = team._id;
	}

	if ( user != null ) {
		requests = user.getRequests( { $and: [ statusFilter, contextFilter ] }/*, { expandPMP: true } */);
		//requests = user.getRequests();
		//console.log( requests );
	}


	return {
		team,
		facilities,
		facility,
		requests,
		selectedRequest
	}
}, RequestsPageIndex );
