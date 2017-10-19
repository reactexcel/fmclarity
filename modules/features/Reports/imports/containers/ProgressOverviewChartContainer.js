import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import ProgressOverviewChart from "../reports/ProgressOverviewChart";
import { RequestOverviewAggregate } from "/modules/models/Reports";

export default (ProgressOverviewChartContainer = withTracker(
  ({ facility, team }) => {
    let progressOverviewConfig = Session.get("progress-overview-config");
    let handle = Meteor.subscribe(
      "RequestOverview: Aggregate",
      moment()
        .subtract(1, "y")
        .startOf("month")
        .toDate(),
      moment().toDate(),
      team,
      facility || null
    );

    let queries = {
      New: { thisPeriod: 0, lastPeriod: 0 },
      Issued: { thisPeriod: 0, lastPeriod: 0 },
      Complete: { thisPeriod: 0, lastPeriod: 0 }
    };

    let defaultStartDate = moment()
      .subtract(2, "months")
      .startOf("month");
    let defaultEndDate = moment().endOf("month");
    let defaultPeriod = { number: 3, unit: "month" };

    let startDate = moment(
      progressOverviewConfig ? progressOverviewConfig.start : defaultStartDate
    );
    let endDate = moment(
      progressOverviewConfig ? progressOverviewConfig.end : defaultEndDate
    );
    let period = progressOverviewConfig
      ? progressOverviewConfig.period
      : defaultPeriod;

    if (team && team._id) {
      let baseQuery = {
        team_id: team._id
      };
      if (facility && facility._id) {
        baseQuery["facility_id"] = facility._id;
      }

      let current = {
        start: startDate.clone().startOf("month"),
        end: endDate.clone().endOf("month")
      };

      let previous = {
        start: startDate
          .clone()
          .subtract(period.number, period.unit + "s")
          .startOf("month"),
        end: endDate
          .clone()
          .subtract(period.number, period.unit + "s")
          .endOf("month")
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

    return {
      ready: handle.ready(),
      facility,
      team,
      queries
    };
  }
)(ProgressOverviewChart));
