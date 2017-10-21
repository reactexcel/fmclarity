import { Requests } from '/modules/models/Requests';
import RequestOverviewAggregateSchema from './schemas/RequestOverviewAggregateSchema';

/**
 * @memberOf		module:models/Reports
 */

const RequestOverviewAggregate = new Mongo.Collection('RequestOverviewAggregate');
RequestOverviewAggregate.schema = new SimpleSchema(RequestOverviewAggregateSchema);


RequestOverviewAggregate.computeAggregateData = (requestDate, team_id, facility_id) => {
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

  let selector = {
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

  let update = Object.assign({}, selector, queries);
  RequestOverviewAggregate.upsert(
    { ...selector },
    {
      $set: update
    }
  );
}

RequestOverviewAggregate.loadQueries = (start, end, period, team, facility) => {
  
  if (Meteor.isClient) {
    let queries = {
      New: { thisPeriod: 0, lastPeriod: 0 },
      Issued: { thisPeriod: 0, lastPeriod: 0 },
      Complete: { thisPeriod: 0, lastPeriod: 0 }
    };
  
    let startDate = moment(start);
    let endDate = moment(end);
  
    if (team && team._id) {
      let baseQuery = {
        team_id: team._id
      };
      if (facility && facility._id) {
        baseQuery['facility_id'] = facility._id;
      }
  
      let current = {
        start: startDate.clone().startOf('month'),
        end: endDate.clone().endOf('month')
      };
  
      let previous = {
        start: startDate
          .clone()
          .subtract(period.number, period.unit + 's')
          .startOf('month'),
        end: endDate
          .clone()
          .subtract(period.number, period.unit + 's')
          .endOf('month')
      };
  
      let qCurrent = _.extend({}, baseQuery, {
        date: {
          $gte: new Date(current.start.toDate()),
          $lte: new Date(current.end.toDate())
        }
      });
  
      let qPrevious = _.extend({}, baseQuery, {
        date: {
          $gte: new Date(previous.start.toDate()),
          $lte: new Date(previous.end.toDate())
        }
      });
  
      let currentRequestsOverview = RequestOverviewAggregate.find(qCurrent);
      currentRequestsOverview.forEach(function(item) {
        if (
          item &&
          item.new_requests > -1 &&
          item.issued_requests > -1 &&
          item.complete_requests > -1
        ) {
          queries.New.thisPeriod += item.new_requests;
          queries.Issued.thisPeriod += item.issued_requests;
          queries.Complete.thisPeriod += item.complete_requests;
        }
      });
  
      let previousRequestsOverview = RequestOverviewAggregate.find(qPrevious);
      previousRequestsOverview.forEach(function(item) {
        if (
          item &&
          item.new_requests > -1 &&
          item.issued_requests > -1 &&
          item.complete_requests > -1
        ) {
          queries.New.lastPeriod += item.new_requests;
          queries.Issued.lastPeriod += item.issued_requests;
          queries.Complete.lastPeriod += item.complete_requests;
        }
      });
    }
  
    return queries;
  }
}


export default RequestOverviewAggregate;
