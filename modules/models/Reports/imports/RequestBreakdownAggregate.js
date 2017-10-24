import { Requests } from "/modules/models/Requests";
import RequestBreakdownAggregateSchema from "./schemas/RequestOverviewAggregateSchema";

/**
 * @memberOf		module:models/Reports
 */
const RequestBreakdownAggregate = new Mongo.Collection(
  "RequestBreakdownAggregate"
);
RequestBreakdownAggregate.schema = new SimpleSchema(
  RequestBreakdownAggregateSchema
);

RequestBreakdownAggregate.computeAggregateData = async (
  requestDate,
  team_id,
  facility_id
) => {
  let date = (requestDate ? moment(requestDate) : moment())
    .startOf("month")
    .add(1, "d");
  let startDate = date.clone().startOf("month");
  let endDate = date.clone().endOf("month");

  let query = {
    createdAt: {
      $gte: startDate.toDate(),
      $lte: endDate.toDate()
    },
    status: { $ne: "Deleted" },
    "team._id": team_id
  };

  if (facility_id) {
    query["facility._id"] = facility_id;
  }

  let selector = {
    team_id: team_id,
    facility_id: facility_id ? facility_id : null,
    serviceName: null,
    date: date.toDate()
  };

  let pipeline = [
    { $match: query },
    {
      $project: {
        serviceName: "$service.name",
        costThreshold: "$costThreshold"
      }
    },
    {
      $group: {
        _id: { serviceName: "$serviceName" },
        count: { $sum: "$costThreshold" }
      }
    },
    {
      $project: {
        serviceName: "$_id.serviceName",
        totalCostThreshold: "$count"
      }
    }
  ];

  let requests = Requests.collection.aggregate(pipeline);

  for (let request of requests) {
    let currentSelector = Object.assign({}, selector, {
      serviceName: request.serviceName
    });
    let update = Object.assign({}, currentSelector, {
      totalCostThreshold: request.totalCostThreshold
    });

    RequestBreakdownAggregate.upsert(
      { ...currentSelector },
      {
        $set: update
      }
    );
  }
};

RequestBreakdownAggregate.getData = (startDate, team, facility) => {
  if (Meteor.isClient) {
    let query = {
      date: {
        $gte: new Date(moment(startDate).toDate())
      }
    };

    if (team && team._id) {
      query["team_id"] = team._id;
    }

    if (facility && facility._id) {
      query["facility_id"] = facility._id;
    }

    let items = {};
    let result = RequestBreakdownAggregate.find(query)
      .fetch()
      .map((item, index) => {
        if (!items[items.serviceName]) {
          items[item.serviceName] = item;
        } else {
          items[item.serviceName].totalCostThreshold += item.totalCostThreshold;
        }
      });

    return items;
  }
};

export default RequestBreakdownAggregate;
