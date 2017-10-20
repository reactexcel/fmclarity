
export default RequestBreakdownAggregateSchema = {
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
  serviceName: {
		optional: false,
		type: String
  },
  totalCostThreshold: {
		optional: false,
		type: Number
  }
}

