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

    let facility = Session.getSelectedFacility(),
        team = Session.getSelectedTeam(),
        user = Meteor.user(),
        facilities = null,
        statusFilter = { "status": { $nin: [ "Cancelled", "Deleted", "Closed", "Reversed" ] } },
        contextFilter = {};

    if ( team ) {
        facilities = team.getFacilities(); //Facilities.findAll( { 'team._id': team._id } );
        if ( facilities ) {
            let facilityThumbs = _.pluck( facilities, 'thumb' );
            Meteor.subscribe( 'Thumbs', facilityThumbs );
        }
    }

    if ( facility && facility._id ) {
        contextFilter[ 'facility._id' ] = facility._id;
    } else if ( team && team._id ) {
        contextFilter[ 'team._id' ] = team._id;
    }

    return {
        team,
        facilities,
        facility,
        user
    }
}, PageDashboard );

export default PageDashboardContainer;
