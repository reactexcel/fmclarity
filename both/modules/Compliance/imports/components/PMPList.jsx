import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';
import { AutoForm } from '/both/modules/AutoForm';


import PMPListTile from './PMPListTile.jsx';

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

PMPGroup = React.createClass({

    showModal(request) {
        //Need a width option for modals before this can be instantiated
        request.type = "Preventative";
        Modal.show({
            content:<AutoForm 
                item={request} 
                form={Issues.forms.create}
            >            
                <h2>Edit Preventative Maintenence Event</h2>
            </AutoForm>,
            size:"large"
        })
    },

    render() {
        var requests = this.props.items;
        return (
            <div>
                {requests&&requests.length?requests.map((r,idx)=>{
                    return (
                        <div className="grid-item" key={idx} style={{height:"48px",paddingTop:"5px"}} onClick={()=>{FABActions.viewRequest(r)}}>
                            <PMPListTile item={r}/>
                        </div>
                    )
                }):null}
            </div>
        )
    }
})