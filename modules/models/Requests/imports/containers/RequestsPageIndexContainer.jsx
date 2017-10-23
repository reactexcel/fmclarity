import React from "react";
import {createContainer} from 'meteor/react-meteor-data';
import RequestsPageIndex from '../components/RequestsPageIndex.jsx';
import {Facilities} from '/modules/models/Facilities';
import {Requests} from '/modules/models/Requests';

export default RequestsPageIndexContainer = createContainer(({selectedRequestId}) => {

  let facility = Session.getSelectedFacility(),
    selectedStatus = Session.get('selectedStatus'),
    team = Session.getSelectedTeam(),
    user = Meteor.user(),
    requests = null,
    facilities = null,
    contextFilter = {},
    selectedRequest = null,
    includeComplete = false;
  let thumbsReady = false;

  let statusFilterResult = getStatusFilter(selectedStatus);
  let statusFilter = statusFilterResult.statusFilter;
  selectedStatus = statusFilterResult.selectedStatus;

  if (includeComplete) {
    Meteor.subscribe('Requests: Complete');
  }

  if (selectedRequestId) {
    selectedRequest = Requests.findOne(selectedRequestId);
  }

  if (team) {
    //facilities = Facilities.findAll( { 'team._id': team._id } );
    facilities = team.getFacilities();
    if (facilities) {
      let facilityThumbs = _.pluck(facilities, 'thumb');
      let thumbsHandle = Meteor.subscribe('Thumbs', facilityThumbs);
      thumbsReady = thumbsHandle.ready()
    }
  }

  if (facility && facility._id) {
    contextFilter['facility._id'] = facility._id;
  } else if (team && team._id) {
    //contextFilter[ 'team._id' ] = team._id;
  }

  function getStatusFilter(selectedStatus) {
    let statusFilter = {};
    if (selectedStatus == 'New') {
      statusFilter = {"status": 'New'};
    }
    else if (selectedStatus == 'Issued') {
      statusFilter = {"status": 'Issued'};
    }
    else if (selectedStatus == 'Complete') {
      statusFilter = {"status": 'Complete'};
      includeComplete = true;
    }
    else if (selectedStatus == 'Close') {
      statusFilter = {"status": 'Close'};
      includeComplete = true;
    }
    else if (selectedStatus == 'Booking') {
      statusFilter = {"status": 'Booking'};
    }
    else if (selectedStatus == 'Preventative') {
      statusFilter = {
        "status": 'Issued', "type": 'Preventative'
      };
    }
    else if (selectedStatus == 'Cancelled') {
      statusFilter = {"status": 'Cancelled'};
      includeComplete = true;
    }
    else if (selectedStatus == 'All') {
      statusFilter = {"status": {$in: ['Open', 'Booking', 'New', 'Issued', 'Complete', 'Close', 'Cancelled']}};
      includeComplete = true;
    }
    else {
      selectedStatus = 'Open';
      statusFilter = {"status": {$in: ['New', 'Issued', 'Booking']}};
    }
    return {
      selectedStatus,
      statusFilter
    };
  }


  return {
    team,
    facilities,
    requests,
    facility,
    selectedStatus,
    selectedRequest,
    contextFilter,
    statusFilter,
    user,
    getStatusFilter,
    thumbsReady
  }
}, RequestsPageIndex);
