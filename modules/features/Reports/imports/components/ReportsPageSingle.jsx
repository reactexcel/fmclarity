/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import Reports from '../Reports.js';
import { FacilityFilter } from '/modules/models/Facilities';

/**
 * A componet that displays a single report
 * @class 			ReportsPageSingle
 * @memberOf 		module:features/Reports
 * @param 			{string} id - the registered id of the report that should be rendered
 */
function ReportsPageSingle( props ) {
	let { id, facilities, facility, team } = props;
	let report = Reports.get( { id } ),
		ReportComponent = null;
	if ( report ) {
		ReportComponent = report.content;
	}
	return (
		<div className="report-page animated fadeIn">
			<FacilityFilter items={ facilities } selectedItem={ facility }/>
			<div className="row" style={{paddingTop:'50px'}}>
				<div className="col-md-12">
					<div className="ibox">
						<div className="ibox-content">
							<ReportComponent team={team} facility={facility} facilities={facilities} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ReportsPageSingle;
