
const ReportsCron = {
  name: 'Compute Aggregate Data for Requests',
  schedule: function( parser ) {
      return parser.cron("1 */6 * * *"); // run cron at the first minute every 6 hrs
      // return parser.text("every 1 minute");
  },
  job: () => {
    Meteor.call('Reports.computeAggregateDataForThePastTwoYears');
  }
}

export default ReportsCron;