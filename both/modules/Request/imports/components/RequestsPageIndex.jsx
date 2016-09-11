import React from "react";

import { FacilityFilter } from '/both/modules/Facility';
import { RequestsTable } from '/both/modules/Request';

export default function RequestsPageIndex( props ) {
	let { filter, headers, team, facility } = props;

	return (
		<div>
			<FacilityFilter team = { team } facility = { facility }/>
			<div className = "issue-page animated fadeIn" style = { {paddingTop:"50px"} }>
				<div className = "ibox">
					<RequestsTable filter = { filter }/>
				</div>
			</div>
		</div>
	);
}
