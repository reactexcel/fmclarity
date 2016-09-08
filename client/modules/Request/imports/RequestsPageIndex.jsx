import React from "react";

import FacilityFilter from '/client/modules/Facility/imports/FacilityFilter.jsx';

export default function RequestsPageIndex( props )
{
	let { filter, headers, team, facility } = props;

	return (
		<div>
	        <FacilityFilter team = { team } facility = { facility }/>
	        <div className="issue-page animated fadeIn" style={{paddingTop:"50px"}}>
	        	<RequestsTable 
	        		headers = { headers }
	        		filter = { filter }
	        	/>
			</div>
		</div>
	);
}