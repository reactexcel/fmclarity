import React from "react";
import {ReactMeteorData} from 'meteor/react-meteor-data';

import PMPGroup from './PMPGroup.jsx';
import { TeamActions } from '/modules/models/Teams';
import {PPM_Schedulers } from '/modules/models/Requests';

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
        var statusFilter = {"status":"PPM"};
        var customFilter = this.props.filter;
        var filter = {$and:[statusFilter,customFilter]};
        // var ungroupedRequests = Meteor.user().getRequests(filter);
        let query = [],
            team = Session.getSelectedTeam(),
            teamId = null;

        if( team ) {
            teamId = team._id;
            query.push( {
                $or: [
                    { 'team._id': teamId },
                    { 'supplier._id': teamId },
                    { 'realEstateAgency._id': teamId }
                ]
            } );
        }

        //if filter passed to function then add that to the query
        if ( filter ) {
            query.push( filter );
        }
        var ungroupedRequests = PPM_Schedulers.find( {
                $and: query
            } )
            .fetch( {
                sort: {
                    createdAt: 1
                }
            } );
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
        let team = Session.getSelectedTeam();
		return (
			<div>
        <div style={{margin:"10px",fontWeight:"700",cursor:"pointer"}} onClick={()=>{
          TeamActions.createPPM_Schedulers.run( team );

        }}>+ Add another</div>
				{keys.map((k,idx)=>{
                    return (
                        <div key={idx}>
                            <div style={{borderBottom:"1px solid #ddd",backgroundColor:"#eee",padding:"14px 10px",fontWeight:'bold'}}>{k}</div>
                            <PMPGroup items={requests[k]}/>
                        </div>
                    )
				})}
			</div>
		)
	}
})
