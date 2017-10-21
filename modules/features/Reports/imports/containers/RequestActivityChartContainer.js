import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';

import RequestActivityChart from '../reports/RequestActivityChart';
import { RequestActivityAggregate } from '/modules/models/Reports';

const defaultStartDate = moment()
  .subtract(2, 'months')
  .startOf('month');
const defaultEndDate = moment().endOf('month');
let defaultSubStartDate = defaultStartDate
  .clone()
  .subtract(1, 'y')
  .startOf('month');

const RequestActivityConfig = new ReactiveVar({
  start: defaultStartDate,
  end: defaultEndDate
});

const limit = null;

export default (RequestActivityChartContainer = withTracker(
  ({ facility, team }) => {
    let config = RequestActivityConfig.get();

    let handle = Meteor.subscribe(
      'RequestActivity: Aggregate',
      defaultSubStartDate.toDate(),
      defaultEndDate.toDate(),
      team,
      facility || null,
      limit
    );

    let data = RequestActivityAggregate.getData(
      config.start,
      config.end,
      team,
      facility
    );

    return {
      ready: handle.ready(),
      facility,
      team,
      data,
      configVar: RequestActivityConfig
    };
  }
)(RequestActivityChart));
