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

	if ( team ) {
		facilities = team.getFacilities();//Facilities.findAll( { 'team._id': team._id } );
		if ( facilities ) {
			let facilityThumbs = _.pluck( facilities, 'thumb' );
			Meteor.subscribe( 'Thumbs', facilityThumbs );
		}
	}

	return {
		facilities,
		facility,
		team
	}
}, ReportsPageSingle );

export default ReportsPageSingleContainer;
