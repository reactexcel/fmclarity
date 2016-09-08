import React from "react";

export default function RequestPriority( props ) {
	let priority = props.request.priority;
	return (
		<span title = { priority } style={ {fontSize:"20px",position:"relative",top:"5px"} }>
	    	<i className={ "fa fa-circle" + ( priority == 'Scheduled' ? '-o' : '' ) + " priority-" + ( priority ) }></i>
	    </span>
	)
}
