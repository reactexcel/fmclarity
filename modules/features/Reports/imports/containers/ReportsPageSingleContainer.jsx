/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReportsPageSingle from '../components/ReportsPageSingle.jsx';
import { Facilities } from '/modules/models/Facilities';

/**
 * @class 			PageDashboardContainer
 * @memberOf 		module:features/Reports
 */
const ReportsPageSingleContainer = createContainer( ( params ) => {

	// console.log( params );

	let facility = Session.getSelectedFacility(),
		team = Session.getSelectedTeam(),
		facilities = null;
	let thumbsReady = false;
	if ( team ) {
		facilities = team.getFacilities();//Facilities.findAll( { 'team._id': team._id } );
		if ( facilities ) {
			let facilityThumbs = _.pluck( facilities, 'thumb' );
			let thumbsHandle = Meteor.subscribe('Thumbs', facilityThumbs);
      thumbsReady = thumbsHandle.ready()
		}
	}

	return {
		facilities,
		facility,
		team,
    thumbsReady
	}
}, ReportsPageSingle );

export default ReportsPageSingleContainer;
