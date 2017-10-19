
export default RequestOverviewAggregateSchema = {
	team_id: {
		optional: true,
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
    type: Number,
    defaultValue: 0
  },
  issued_requests: {
    type: Number,
    defaultValue: 0
  },
  complete_requests: {
    type: Number,
    defaultValue: 0
  },
}

