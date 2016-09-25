/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";

import { FacilityFilter } from '/modules/models/Facilities';
import { RequestsTable } from '/modules/models/Requests';

/**
 * @class 			RequestsPageIndex
 * @memberOf 		module:models/Requests
 */
function RequestsPageIndex( props ) {
	let { team, facility, facilities, requests } = props;

	if( !team ) {
		return <div/>
	}
	return (
		<div>
			<FacilityFilter items = { facilities } selectedItem = { facility } />
			<div className = "issue-page animated fadeIn" style = { {paddingTop:"50px"} }>
				<div className = "ibox">
					<RequestsTable requests = { requests }/>
				</div>
			</div>
		</div>
	)
}

export default RequestsPageIndex;