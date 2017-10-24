import { Requests } from '/modules/models/Requests';
import RequestActivityAggregateSchema from './schemas/RequestActivityAggregateSchema';

/**
 * @memberOf		module:models/Reports
 */
const RequestActivityAggregate = new Mongo.Collection(
  'RequestActivityAggregate'
);
RequestActivityAggregate.schema = new SimpleSchema(
  RequestActivityAggregateSchema
);

RequestActivityAggregate.computeAggregateData = async (
  requestDate,
  team_id,
  facility_id
) => {
  let date = (requestDate ? moment(requestDate) : moment())
    .startOf('month')
    .add(1, 'd');
  let startDate = date.clone().startOf('month').add(1, 's');
  let endDate = date.clone().endOf('month');

  let query = {
    createdAt: {
      $gte: startDate.toDate(),
      $lte: endDate.toDate()
    },
    status: { $ne: 'Deleted' },
    'team._id': team_id
  };

  if (facility_id) {
    query['facility._id'] = facility_id;
  }

  let openQuery = Object.assign({}, query, { status: { $ne: 'Complete' } });
  let closedQuery = Object.assign({}, query, { status: 'Complete' });

  let selector = {
    team_id: team_id,
    facility_id: facility_id ? facility_id : null,
    date: date.toDate()
  };

  let groupId = {
    month: { $month: '$createdAt' },
    year: { $year: '$createdAt' }
  };
  let openPipeline = [
    { $match: openQuery },
    {
      $group: {
        _id: groupId,
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        count: '$count',
        date: '$_id'
      }
    }
  ];

  let openResults = Requests.collection.aggregate(openPipeline);

  let closedPipeline = [
    { $match: closedQuery },
    {
      $group: {
        _id: groupId,
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        count: '$count',
        date: '$_id'
      }
    }
  ];
  let closedResults = Requests.collection.aggregate(closedPipeline);

  let update = Object.assign({}, selector, {
    openRequests: openResults.length > 0 ? openResults[0].count : 0,
    closedRequests: closedResults.length > 0 ? closedResults[0].count : 0
  });

  RequestActivityAggregate.upsert(
    { ...selector },
    {
      $set: update
    }
  );
};

RequestActivityAggregate.getData = (startDate, endDate, team, facility) => {
  if (Meteor.isClient) {
    let query = {
      date: {
        $gte: new Date(moment(startDate).toDate()),
        $lt: new Date(moment(endDate).toDate())
      },
      team_id: team._id
    };

    if (facility && facility._id) {
      query['facility_id'] = facility._id;
    }

    let items = {};
    let result = RequestActivityAggregate.find(query)
      .fetch()
      .map((item, index) => {
        let key = moment(item.date).format('YYYY_MM_DD') + '_' + item.team_id
        if (facility && facility._id) {
          key += '_' + item.facility_id
        }

        if (!items[key]) {
          items[key] = item;
        } else {
          items[key].openRequests += item.openRequests;
          items[key].closedRequests += item.closedRequests;
        }
      });
    return items;
  }
};

export default RequestActivityAggregate;
