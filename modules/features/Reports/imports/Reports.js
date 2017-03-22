import RequestsStatusReport from './reports/RequestsStatusReport.jsx';
import RequestBreakdownChart from './reports/RequestBreakdownChart.jsx';
import RequestActivityChart from './reports/RequestActivityChart.jsx';
import MBMServiceImages from './reports/MBMServiceImages.jsx';

const Reports = {
	dict: {},
	register: function( data ) {
		this.dict[ data.id ] = data;
	},
	get: function( data ) {
		return this.dict[ data.id ];
	},
	getAll: function() {
		return this.dict;
	}
}

Reports.register( {
	id: "requests-status",
	name: "Requests Status Report",
	content: RequestsStatusReport
} )

Reports.register( {
    id: "request-breakdown-chart",
    name: "Request Breakdown Chart",
    content: RequestBreakdownChart
} )

Reports.register( {
	id: "request-activity-chart",
	name: "Request Activity Chart",
	content: RequestActivityChart
} )

Reports.register( {
	id: "mbm-service-image",
	name: "MBM Service Image",
	content: MBMServiceImages
} )

export default Reports;
