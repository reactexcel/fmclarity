/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";
import ComplianceViewDetail from './ComplianceViewDetail.jsx';
import { FacilityFilter } from '/modules/models/Facilities';

/**
 * @class 			CompliancePageIndex
 * @memberOf		module:features/Compliance
 */
function CompliancePageIndex( props ) {
	let { team, services, facility, facilities } = props;

	if( !team ) {
		return <div/>
	}

	return (
		<div className = "facility-page animated fadeIn">

	        <FacilityFilter items = { facilities }/>
	        <div style = { {paddingTop:"50px"} }>
				<div className="card-body ibox">
					<ComplianceViewDetail items = { services } item = { facility } />
				</div>
			</div>

		</div>
	)
}

export default CompliancePageIndex