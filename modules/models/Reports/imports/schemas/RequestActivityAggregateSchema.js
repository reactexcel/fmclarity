
export default RequestActivityAggregateSchema = {
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
  openRequests: {
		optional: false,
    type: Number,
    defaultValue: 0
  },
  closedRequests: {
		optional: false,
    type: Number,
    defaultValue: 0
  }
}

