import { Model } from '/modules/core/ORM';

import { Owners } from '/modules/mixins/Owners';
import { Roles } from '/modules/mixins/Roles';
import { Members } from '/modules/mixins/Members';
import { DocMessages } from '/modules/models/Messages';

import { Requests } from '/modules/models/Requests';
import { Teams } from '/modules/models/Teams';
import { Facilities } from '/modules/models/Facilities';
import RequestOverviewAggregateSchema from './schemas/RequestOverviewAggregateSchema';

/**
 * @memberOf		module:models/Reports
 */

const RequestOverviewAggregate = new Mongo.Collection('RequestOverviewAggregate', );
RequestOverviewAggregate.schema = new SimpleSchema(RequestOverviewAggregateSchema);


function computeAggregateData(requestDate, team_id, facility_id) {
  let date = (requestDate ? moment(requestDate) : moment())
    .startOf('month')
    .add(1, 'd');
  let startDate = date.clone().startOf('month');
  let endDate = date.clone().endOf('month');

  let queries = {
    new_requests: 0,
    issued_requests: 0,
    complete_requests: 0
  };

  let dateFields = {
    new_requests: 'createdAt',
    issued_requests: 'issuedAt',
    complete_requests: 'closeDetails.completionDate'
  };

  let baseQuery = {
    'team._id': team_id
  };

  if (facility_id) {
    baseQuery['facility._id'] = facility_id;
  }

  let updateParams = {
    team_id: team_id,
    facility_id: facility_id ? facility_id : null,
    date: date.toDate()
  };

  for (let status in queries) {
    let query = _.extend({}, baseQuery, {
      [dateFields[status]]: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate()
      }
    });
    let pipeline = [
      { $match: query },
      { $project: { team_id: '$team._id', facility_id: '$facility._id' } },
      {
        $group: {
          _id: { team_id: '$team_id', facility_id: '$facility_id' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          team_id: '$_id.team_id',
          facility_id: '$_id.facility_id',
          count: '$count'
        }
      }
    ];

    let period = Requests.collection.aggregate(pipeline);
    queries[status] = period.length > 0 ? period[0].count : 0;
  }

  let update = Object.assign({}, updateParams, queries);
  RequestOverviewAggregate.upsert(
    { ...updateParams },
    {
      $set: update
    }
  );
}

Meteor.methods({
  // compute requests aggregate data based on the creation date of the request
  'RequestOverviewAggregate.computeAggregateData': request => {
    if (Meteor.isServer) {
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
    }
  },
  // compute requests aggregate data for all facilities and teams for the last 2 years
  // this should be ran only by a cron which should be set to be ran between long periods of time
  'RequestOverviewAggregate.computeAggregateDataForThePastYear': () => {
    if (Meteor.isServer) {
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
  }
});

export default RequestOverviewAggregate;
