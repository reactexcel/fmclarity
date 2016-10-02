/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import Reports from '../Reports.js';

/**
 * A componet that displays a single report
 * @class 			ReportsPageSingle
 * @memberOf 		module:features/Reports
 * @param 			{string} id - the registered id of the report that should be rendered
 */
function ReportsPageSingle( props ) {
	let report = Reports.get( { id: props.id } ),
		ReportComponent = null;
	if ( report ) {
		ReportComponent = report.content;
	}
	return (
		<div className="report-page animated fadeIn">
			<div className="ibox">
				<ReportComponent/>
			</div>
		</div>
	)
}

export default ReportsPageSingle;
