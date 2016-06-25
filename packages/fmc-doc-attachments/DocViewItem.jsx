import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


DocViewItem = React.createClass({

	mixins: [ReactMeteorData],

	getMeteorData() {
	    var request = this.props.item;
    	return {
    		request:request
		}
	},

	render() {
		var request = this.data.request;
		if(!request) {
			return <div/>
		}
        return (
        <div className={"issue-summary issue-status-"+status}>          
        	<div className="issue-summary-col issue-summary-col-1">
        		{request.name}
        	</div>
        </div>
      )
    }
});