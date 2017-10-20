import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import RequestBreakdownChart from "../reports/RequestBreakdownChart";
import { ReactiveVar } from 'meteor/reactive-var'

import { RequestBreakdownAggregate } from "/modules/models/Reports";


let defaultStartDate = moment().subtract(2, "months").startOf("month");

const RequestBreakdownConfig = new ReactiveVar({
  start: defaultStartDate
});

const defaultEndDate = moment().endOf("month");
const dateOneYearAgo = moment()
  .subtract(1, "y")
  .startOf("month");

export default (RequestBreakdownChartContainer = withTracker(
  ({ facility, facilities, team }) => {

    let handle = Meteor.subscribe(
      "RequestBreakdown: Aggregate",
      dateOneYearAgo.toDate(),
      defaultEndDate.toDate(),
      team,
      facility || null
    );

    let startDate = RequestBreakdownConfig.get().start;
    let requestBreakDownData = RequestBreakdownAggregate.getData(startDate, team, facility);
    
    return {
      ready: handle.ready(),
      data: requestBreakDownData,
      startDate: startDate,
      facility,
      facilities,
      configVar: RequestBreakdownConfig,
    };
  }
)(RequestBreakdownChart));
