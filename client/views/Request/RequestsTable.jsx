import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

RequestsTable = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var item,requests;
    	item = this.props.item;
    	if(item&&item.getIssues) {
    		requests = item.getIssues();
    	}
    	return {
    		requests:requests
    	}
    },

    showModal(r) {
    	Modal.show({
    		content:<IssueDetail item={r}/>
    	})
    },

	render(){
		var requests = this.data.requests;
		var component = this;
		return (
			<div>
				{requests&&requests.length?requests.map(function(r,idx){
					return (
						<div className="grid-item" key={idx} style={{height:"41px"}} onClick={component.showModal.bind(null,r)}>
							<IssueSummary item={r}/>
						</div>
					)
				}):null}
			</div>
		)
	}
})