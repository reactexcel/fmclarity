/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import PageDashboard from '../components/PageDashboard.jsx';
import { Facilities } from '/modules/models/Facilities';

/**
 * @class 			PageDashboardContainer
 * @memberOf 		module:features/Reports
 */
const PageDashboardContainer = createContainer( ( params ) => {
	// this is dud - they should be saved in global state
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Files' );
	
	let team = Session.getSelectedTeam();
		facility = Session.getSelectedFacility(),
		facilities = null;

	if ( team ) {
		facilities = Facilities.findAll( { 'team._id':team._id });
	}

	return {
		team,
		facility,
		facilities
	}
}, PageDashboard );

export default PageDashboardContainer;
