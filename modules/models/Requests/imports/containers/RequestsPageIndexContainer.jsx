import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import RequestsPageIndex from '../components/RequestsPageIndex.jsx';
import { Facilities } from '/modules/models/Facilities';
import { Requests } from '/modules/models/Requests';

export default RequestsPageIndexContainer = createContainer( ( { selectedRequestId } ) => {

	let facility = Session.getSelectedFacility(),
		selectedStatus = Session.get('selectedStatus'),
		team = Session.getSelectedTeam(),
		user = Meteor.user(),
		requests = null,
		facilities = null,
		statusFilter = null,
		contextFilter = {},
		selectedRequest = null,
		includeComplete = false;
	if ( selectedStatus == 'New' ) {
		statusFilter = { "status": 'New' };
	}
	else if ( selectedStatus == 'Issued' ) {
		statusFilter = { "status": 'Issued' };
	}
	else if ( selectedStatus == 'Complete' ) {
		statusFilter = { "status": 'Complete' };
		includeComplete = true;
	}
	else if ( selectedStatus == 'Close' ) {
		statusFilter = { "status": 'Close' };
		includeComplete = true;
	}
	else if ( selectedStatus == 'Booking' ){
		statusFilter = { "status": 'Booking' };
	}
	else if ( selectedStatus == 'Cancelled' ) {
		statusFilter = { "status": 'Cancelled' };
		includeComplete = true;
	}
	else {
		selectedStatus = 'Open';
		statusFilter = { "status": { $in: [ 'New', 'Issued' ] } };
	}

	if( includeComplete ) {
		Meteor.subscribe( 'Requests: Complete' );
	}


	if ( selectedRequestId ) {
		selectedRequest = Requests.findOne( selectedRequestId );
	}

	if ( team ) {
		//facilities = Facilities.findAll( { 'team._id': team._id } );
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

	if ( user != null ) {
	    // could test moving this below loading team and only including facilities if supplier
	console.log( statusFilter ,contextFilter ,"request panel***********************");
		requests = user.getRequests( { $and: [ statusFilter, contextFilter ] }, { expandPMP: true } );
		//requests = user.getRequests();
	}


	return {
		team,
		facilities,
		facility,
		requests,
		selectedStatus,
		selectedRequest,
		contextFilter,
		statusFilter,
		user
	}
}, RequestsPageIndex );
