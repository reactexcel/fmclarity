import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

// RequestsTable
//
// A variation on the 1 column filterbox which includes a left navigation bar
// and a right content section with a large detail view of the selected component
//
// PROPS
//
// items (array)
//      the collection of items to render
//
// filter (object)
//      a mongodb query object used to filter the request results
//
RequestsTable = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var statusFilter = {"status":{$nin:["Cancelled","Deleted","Closed","Reversed"]}};
        var customFilter = this.props.filter;
        var filter = {$and:[statusFilter,customFilter]};
        var data = {};
        data.user = Meteor.user();
        if(data.user) {
            data.requests = data.user.getRequests(filter);
        }
    	return data;
    },

    showModal(r) {
        //Need a width option for modals before this can be instantiated
    	Modal.show({
    		content:<IssueDetail item={r}/>,
            size:"large"
    	})
    },

	render(){
		var requests = this.data.requests;
		return (
			<div>
				{requests&&requests.length?requests.map((r,idx)=>{
					return (
						<div className="grid-item" key={idx} style={{height:"48px",paddingTop:"5px"}} onClick={this.showModal.bind(null,r)}>
							<IssueSummary item={r}/>
						</div>
					)
				}):null}
			</div>
		)
	}
})