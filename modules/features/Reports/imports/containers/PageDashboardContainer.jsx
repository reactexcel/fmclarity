/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import PageDashboard from '../components/PageDashboard.jsx';
import {Facilities} from '/modules/models/Facilities';

/**
 * @class      PageDashboardContainer
 * @memberOf    module:features/Reports
 */
const PageDashboardContainer = createContainer((params) => {

  let user = Meteor.user(),
    facility = Session.getSelectedFacility(),
    team = Session.getSelectedTeam(),
    facilities = null,
    statusFilter = {"status": {$nin: ["Cancelled", "Deleted", "Closed", "Reversed"]}},
    contextFilter = {};
  let thumbsReady = false;

  if (team) {
    facilities = team.getFacilities(); //Facilities.findAll( { 'team._id': team._id } );
    if (facilities) {
      let facilityThumbs = _.pluck(facilities, 'thumb');
      let thumbsHandle = Meteor.subscribe('Thumbs', facilityThumbs);
      thumbsReady = thumbsHandle.ready()
    }
  }

  if (facility && facility._id) {
    contextFilter['facility._id'] = facility._id;
  } else if (team && team._id) {
    contextFilter['team._id'] = team._id;
  }

  return {
    team,
    facilities,
    facility,
    user,
    thumbsReady
  }
}, PageDashboard);

export default PageDashboardContainer;
