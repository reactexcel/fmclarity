import moment from 'moment';
import RequestsStatusReport from './reports/RequestsStatusReport.jsx';
import ResidentDetails from './reports/ResidentDetails.jsx';
import BookingReport from './reports/BookingReport.jsx';
import RequestBreakdownChart from './reports/RequestBreakdownChart.jsx';
import RequestActivityChart from './reports/RequestActivityChart.jsx';
import MBMServiceImages from './reports/MBMServiceImages.jsx';
import MBMDefectImages from './reports/MBMDefectImages.jsx';
import MBMReport from './reports/MBMReport.jsx';
import MonthlyReport from './reports/MonthlyReport.jsx';
import MBMBuildingServiceReport from './reports/MBMBuildingServiceReport.jsx';

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
	id: "resident-listing",
	name: "Resident Listing",
	content: ResidentDetails
} )

Reports.register( {
	id: "requests-status",
	name: "Request Status Report",
	content: RequestsStatusReport
} )

Reports.register( {
	id: "monthly-report",
	name: "Monthly Report" + ' ' + '-' + ' ' + moment().format('MMMM YYYY'),
	content: MonthlyReport
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


// Reports.register( {
// 	id: "mbm-service-image",
// 	name: "Service Image",
// 	content: MBMServiceImages
// } )

Reports.register( {
	id: "mbm-report-contract",
	name: "Report (Service Contract)",
	content: MBMReport
} )

Reports.register( {
	id: "mbm-report-request",
	name: "Report (Building Service Requests)",
	content: MBMBuildingServiceReport
} )

export default Reports;
