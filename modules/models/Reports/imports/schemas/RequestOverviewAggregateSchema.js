export default (RequestOverviewAggregateSchema = {
  team_id: {
    optional: false,
    type: String
  },
  facility_id: {
    optional: true,
    type: String
  },
  date: {
    type: Date,
    defaultValue: Date.now
  },
  new_requests: {
    optional: true,
    type: Number,
    defaultValue: 0
  },
  issued_requests: {
    optional: true,
    type: Number,
    defaultValue: 0
  },
  complete_requests: {
    optional: true,
    type: Number,
    defaultValue: 0
  }
});
