import React from "react";

export default function RequestsPageIndex( props )
{
	let { filter, headers } = props;

	return (
		<div>
	        <FacilityFilter/>
	        <div className="issue-page animated fadeIn" style={{paddingTop:"50px"}}>
	        	<RequestsTable 
	        		headers = {headers}
	        		filter = {filter}
	        	/>
			</div>
		</div>
	);
}