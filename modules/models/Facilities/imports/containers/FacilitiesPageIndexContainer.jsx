/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { createContainer } from 'meteor/react-meteor-data';
import FacilityPageIndex from '../components/FacilityPageIndex.jsx';
import { Facilities } from '/modules/models/Facilities';
import { Roles } from '/modules/mixins/Roles';

/**
 * @class 			FacilitiesPageIndexContainer
 * @memberOf 		module:mixins/Roles
 */
const FacilitiesPageIndexContainer = createContainer( ( params ) => {

	let team = Session.getSelectedTeam(),
		facility = Session.getSelectedFacility(),
		facilities = [],
		logedUser = Meteor.user();

	if ( facility ) {
		let {requests} = Meteor.user().getRequests( { 'facility._id': facility._id } );

		if( requests ) {
			let requestIds = _.pluck( requests, '_id' );
			Meteor.subscribe( 'Inbox: Messages', requestIds );
		}
	}

	if ( team ) {
		facilities = team.getFacilities();
		if ( facilities ) {
			let facilityThumbs = [],
				facilityIds = [];

			facilities.map( ( facility ) => {
				facilityIds.push( facility._id );
				facilityThumbs.push( facility.thumb );
			} )
			Meteor.subscribe( 'Inbox: Messages', facilityIds );
			Meteor.subscribe( 'Thumbs', facilityThumbs );
		}
	}
	if(logedUser){
		if(!_.contains(['fmc support','portfolio manager'],logedUser.getRole()) && !_.contains(['contractor'],team.type)){
	        let newFacilityList = Roles.getAssociateFacility( logedUser );
	        facilities = newFacilityList
	    }
	}
	return {
		team,
		facility,
		facilities
	}

}, FacilityPageIndex );

export default FacilitiesPageIndexContainer;
