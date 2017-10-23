import moment from 'moment';
import RequestsStatusReport from './reports/RequestsStatusReport.jsx';
import ResidentDetails from './reports/ResidentDetails.jsx';
import BookingReport from './reports/BookingReport.jsx';
import RequestBreakdownChartContainer from './containers/RequestBreakdownChartContainer';
import RequestActivityChartContainer from './containers/RequestActivityChartContainer';
import MBMServiceImages from './reports/MBMServiceImages.jsx';
import MBMDefectImages from './reports/MBMDefectImages.jsx';
import MBMReport from './reports/MBMReport.jsx';
import MonthlyReport from './reports/MonthlyReport.jsx';
import MBMBuildingServiceReport from './reports/MBMBuildingServiceReport.jsx';
import WorkOrderReport from './reports/WorkOrderReport.jsx';

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
    content: RequestBreakdownChartContainer
} )

Reports.register( {
	id: "request-activity-chart",
	name: "Request Activity Chart",
	content: RequestActivityChartContainer
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

Reports.register( {
	id: "work-order-report",
	name: "Work Order Report",
	content: WorkOrderReport
} )

export default Reports;
