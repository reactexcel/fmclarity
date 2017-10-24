import { Teams } from '/modules/models/Teams';
import { Facilities } from '/modules/models/Facilities';
import { Requests } from '/modules/models/Requests';

import {
  RequestOverviewAggregate,
  RequestBreakdownAggregate,
  RequestActivityAggregate
} from "../";

async function cleanupRequestsCollection() {
  let requests = Requests.find({ costThreshold: { $type: 2 }}); // find all requests that has the type of string
  let total = requests.count();
  let count = 1;
  requests.fetch().map((request) => {
    if (request && request._id) {
      let costThreshold = parseFloat(request.costThreshold);
      Requests.collection.update(
        { _id: request._id },
        {
          $set: {
            costThreshold: isNaN(costThreshold) ? 0 : costThreshold
          }
        }
      );
      count++;
    }
  });
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
  'Reports.computeAggregateDataForThePastTwoYears': async () => {
    await cleanupRequestsCollection();

    let date = moment()
      .startOf('month')
      .add(1, 'd');
    let startDate = date
      .clone()
      .subtract(2, 'y')
      .startOf('month');
    let oneYearAgo = date
      .clone()
      .subtract(1, 'y')
      .startOf('month');
    let endDate = date.clone().endOf('month');
    let currentDate = endDate.clone();

    let teams = Teams.find({}).fetch();
    let facilities = Facilities.find({}).fetch();
    
    while (moment(currentDate).isAfter(moment(startDate))) {
      for (let team of teams) {
        for (let facility of facilities) {    
          if (facility.team && facility.team._id === team._id) {
            await RequestOverviewAggregate.computeAggregateData(currentDate, team._id, facility._id);
            if (moment(currentDate).isAfter(oneYearAgo)) {
              await RequestBreakdownAggregate.computeAggregateData(currentDate, team._id, facility._id);
              await RequestActivityAggregate.computeAggregateData(currentDate, team._id, facility._id);
            }
            console.log(currentDate.format('MMM YYYY') + ' Team ' + team.name + ': Finished Aggregation of Facility ' + facility.name + '');
          }
        }
      }
      currentDate.subtract(1, 'M');
    }
  }
});
