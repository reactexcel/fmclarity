import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var'

import ProgressOverviewChart from '../reports/ProgressOverviewChart';
import { RequestOverviewAggregate } from '/modules/models/Reports';

const defaultStartDate = moment().subtract(2, 'months').startOf('month');
const defaultEndDate = moment().endOf('month');
const defaultPeriod = { number: 3, unit: 'month' };
const dateOneYearAgo = moment().subtract(1, 'y').startOf('month');

const ProgressOverviewConfig = new ReactiveVar({
  start: defaultStartDate,
  end: defaultEndDate,
  period: defaultPeriod,
});

export default (ProgressOverviewChartContainer = withTracker(
  ({ facility, team }) => {
    let progressOverviewConfig = ProgressOverviewConfig.get();

    let handle = Meteor.subscribe(
      'RequestOverview: Aggregate',
      dateOneYearAgo.toDate(),
      defaultEndDate.toDate(),
      team,
      facility || null
    );

    let queries = {
      New: { thisPeriod: 0, lastPeriod: 0 },
      Issued: { thisPeriod: 0, lastPeriod: 0 },
      Complete: { thisPeriod: 0, lastPeriod: 0 }
    };

    let startDate = moment(progressOverviewConfig.start);
    let endDate = moment(progressOverviewConfig.end);
    let period = progressOverviewConfig.period;

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

    return {
      ready: handle.ready(),
      facility,
      team,
      queries,
      configVar: ProgressOverviewConfig
    };
  }
)(ProgressOverviewChart));
