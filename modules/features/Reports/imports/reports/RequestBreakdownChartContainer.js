import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import RequestBreakdownChart from './RequestBreakdownChart';

let getRequestBreakdown = (config, callback) => {

  Meteor.call('Requests.getRequestAmountBreakdown', config, (error, response) => {
    if (!error) {
      if (_.isFunction(callback)) {
        callback(response);
      }
    } else {
      console.log(error);
    }
  });
};

export default RequestBreakdownChartContainer = withTracker(({facility, facilities, team}) => {
      return {
        facility,
        facilities,
        team,
        getRequestBreakdown: getRequestBreakdown
      };
    })(RequestBreakdownChart);
    