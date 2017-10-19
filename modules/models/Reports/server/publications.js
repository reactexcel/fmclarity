import { RequestOverviewAggregate } from "/modules/models/Reports";

Meteor.publish(
  "RequestOverview: Aggregate",
  (startDate, endDate, team, facility) => {
    let baseQuery = {
      team_id: team._id
    };

    if (facility && facility._id) {
      baseQuery["facility_id"] = facility._id;
    }

    if (startDate) {
      startDate = moment(startDate);
    }

    if (endDate) {
      endDate = moment(endDate);
    }

    let current = {
      start: startDate.clone().startOf("month"),
      end: endDate.clone().endOf("month")
    };

    let q = _.extend({}, baseQuery, {
      date: {
        $gte: current.start.toDate(),
        $lte: current.end.toDate()
      }
    });

    return RequestOverviewAggregate.find(q);
  }
);
