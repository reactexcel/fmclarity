import React from "react";

const RequestPriority = ( { request} ) => {
	let priority = request.priority;
	return (
		<span 
			title = { priority } 
			style={ {fontSize:"20px",position:"relative",top:"5px"} }
		>

	    	<i className={ "fa fa-circle" + ( priority == 'Scheduled' ? '-o' : '' ) + " priority-" + ( priority ) }></i>

	    </span>
	)
}

export default RequestPriority;
