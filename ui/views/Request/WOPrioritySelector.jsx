import React from "react";

IssuePriority = React.createClass({
	render() {
	    var issue = this.props.issue;
	    var priority = issue.priority;
	    return (
	    	<span title={priority} style={{fontSize:"20px",position:"relative",top:"3px"}}>
	    		<i className={"fa fa-circle"+(priority=='Scheduled'?'-o':'')+" priority-"+(priority)}></i>
	    	</span>
	    )
	}
})