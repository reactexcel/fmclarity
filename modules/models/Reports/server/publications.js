import {
  RequestOverviewAggregate,
  RequestBreakdownAggregate,
  RequestActivityAggregate
} from '/modules/models/Reports';

Meteor.publish(
  'RequestOverview: Aggregate',
  (startDate, endDate, team, facility, limit) => {
    console.log(startDate, endDate);
    let aggregate = queryAggregate(
      RequestOverviewAggregate,
      startDate,
      endDate,
      team,
      facility,
      limit
    );
    if (aggregate) {
      return aggregate;
    }

    return this.ready();
  }
);

Meteor.publish(
  'RequestBreakdown: Aggregate',
  (startDate, endDate, team, facility) => {
    let aggregate = queryAggregate(
      RequestBreakdownAggregate,
      startDate,
      endDate,
      team,
      facility
    );
    if (aggregate) {
      return aggregate;
    }

    return this.ready();
  }
);

Meteor.publish(
  'RequestActivity: Aggregate',
  (startDate, endDate, team, facility, limit) => {
    let aggregate = queryAggregate(
      RequestActivityAggregate,
      startDate,
      endDate,
      team,
      facility,
      limit
    );
    if (aggregate) {
      return aggregate;
    }

    return this.ready();
  }
);

function queryAggregate(
  aggregateCollection,
  startDate,
  endDate,
  team,
  facility,
  limit
) {
  if (team) {
    let opts = {};

    if (limit) {
      opts['limit'] = limit;
    }

    let baseQuery = {
      team_id: team._id
    };

    if (facility && facility._id) {
      baseQuery['facility_id'] = facility._id;
    }

    if (startDate) {
      startDate = moment(startDate);
    }

    if (endDate) {
      endDate = moment(endDate);
    }

    let current = {
      start: startDate.clone().startOf('month'),
      end: endDate.clone().endOf('month')
    };

    let q = _.extend({}, baseQuery, {
      date: {
        $gte: current.start.toDate(),
        $lte: current.end.toDate()
      }
    });

    let response = aggregateCollection.find(q, opts);
    if (response) {
      return response;
    }
  }

  return null;
}
