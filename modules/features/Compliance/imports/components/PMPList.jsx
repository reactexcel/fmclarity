import React from "react";
import {ReactMeteorData} from 'meteor/react-meteor-data';

import PMPGroup from './PMPGroup.jsx';

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
export default PMPList = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var statusFilter = {"status":"PMP"};
        var customFilter = this.props.filter;
        var filter = {$and:[statusFilter,customFilter]};
        var ungroupedRequests = Meteor.user().getRequests(filter);
        var requests = _.groupBy(ungroupedRequests,function(r){
            return r.service?r.service.name:"Other";
        })
    	return {
    		requests:requests
    	}
    },

	render(){
		var requests = this.data.requests;
        var keys = _.keys(this.data.requests).sort();
		return (
			<div>
				{keys.map((k,idx)=>{
                    return (
                        <div key={idx}>
                            <div style={{borderBottom:"1px solid #ddd",backgroundColor:"#eee",padding:"14px 10px"}}>{k}</div>
                            <PMPGroup items={requests[k]}/>
                        </div>
                    )
				})}
			</div>
		)
	}
})

