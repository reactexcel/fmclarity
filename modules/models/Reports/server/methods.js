import { Teams } from '/modules/models/Teams';
import { Facilities } from '/modules/models/Facilities';

import {
  RequestOverviewAggregate,
  RequestBreakdownAggregate,
  RequestActivityAggregate
} from "../";

function computeAggregateData(requestDate, team_id, facility_id) {
  RequestOverviewAggregate.computeAggregateData(requestDate, team_id, facility_id);
  RequestBreakdownAggregate.computeAggregateData(requestDate, team_id, facility_id);
  RequestActivityAggregate.computeAggregateData(requestDate, team_id, facility_id);
}

Meteor.methods({
  // compute requests aggregate data based on the creation date of the request
  'Reports.computeAggregateData': request => {
    if (request && request._id) {
      if (request.team && request.team._id) {
        let facility_id =
          request.facility && request.facility._id
            ? request.facility._id
            : null;
        computeAggregateData(
          request.createdAt,
          request.team._id,
          facility_id
        );
      }
    }
  },
  // compute requests aggregate data for all facilities and teams for the last 2 years
  // this should be ran only by a cron which should be set to be ran between long periods of time
  'Reports.computeAggregateDataForThePastTwoYears': () => {
    let date = moment()
      .startOf('month')
      .add(1, 'd');
    let startDate = date
      .clone()
      .subtract(2, 'y')
      .startOf('month');
    let endDate = date.clone().endOf('month');
    let currentDate = startDate.clone();

    // get all teams
    let teams = Teams.find({}).fetch();

    // loop through all teams
    for (let team of teams) {
      let facilities = Facilities.find({ 'team._id': team._id }).fetch();

      if (facilities.length > 0) {
        while (moment(currentDate).isBefore(moment(endDate))) {
          for (let facility of facilities) {
            computeAggregateData(currentDate, team._id, facility._id);
          }
          currentDate.add(1, 'M');
        }
      }
    }
  }
});