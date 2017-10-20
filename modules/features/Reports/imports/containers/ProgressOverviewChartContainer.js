import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';

import ProgressOverviewChart from '../reports/ProgressOverviewChart';
import { RequestOverviewAggregate } from '/modules/models/Reports';

const defaultStartDate = moment()
  .subtract(2, 'months')
  .startOf('month');
const defaultEndDate = moment().endOf('month');
const defaultPeriod = { number: 3, unit: 'month' };
const dateTwoYearsAgo = moment()
  .subtract(2, 'y')
  .startOf('month');

const ProgressOverviewConfig = new ReactiveVar({
  start: defaultStartDate,
  end: defaultEndDate,
  period: defaultPeriod
});

export default (ProgressOverviewChartContainer = withTracker(
  ({ facility, team }) => {
    let progressOverviewConfig = ProgressOverviewConfig.get();

    let handle = Meteor.subscribe(
      'RequestOverview: Aggregate',
      dateTwoYearsAgo.toDate(),
      defaultEndDate.toDate(),
      team,
      facility || null
    );

    let queries = RequestOverviewAggregate.loadQueries(
      progressOverviewConfig.start,
      progressOverviewConfig.end,
      progressOverviewConfig.period,
      team,
      facility
    );

    return {
      ready: handle.ready(),
      facility,
      team,
      queries,
      configVar: ProgressOverviewConfig
    };
  }
)(ProgressOverviewChart));
