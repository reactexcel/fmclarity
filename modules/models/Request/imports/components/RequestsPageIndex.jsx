import React from "react";

import { FacilityFilter } from '/modules/models/Facility';
import { RequestsTable } from '/modules/models/Request';

export default function RequestsPageIndex( props ) {
	let { team, facility, requests } = props;

	return (
		<div>
			<FacilityFilter team = { team } facility = { facility }/>
			<div className = "issue-page animated fadeIn" style = { {paddingTop:"50px"} }>
				<div className = "ibox">
					<RequestsTable requests = { props.requests }/>
				</div>
			</div>
		</div>
	);
}
