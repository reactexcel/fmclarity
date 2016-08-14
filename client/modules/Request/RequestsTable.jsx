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
        let statusFilter = {"status":{$nin:["Cancelled","Deleted","Closed","Reversed"]}},
            customFilter = this.props.filter,
            filter = {$and:[statusFilter,customFilter]},
            data = {};

        data.user = Meteor.user();
        if(data.user) {
            let requests = [];
            requests = data.user.getRequests(filter,{expandPMP:true});
            data.requests = this.applySort(requests);
        }
    	return data;
    },

    getInitialState() {
        return {
            expandedItem:null,
            selectedFilterNum:0,
            selectedSortNum:null,
            sortDirection:1
        }
    },

    //applies the sort operation to the given items
    //sort functions should have been provided with the headers
    applySort(items) {
        let headers = this.props.headers;

        if(items&&headers) {
            let sortNum = this.state.selectedSortNum,
                f = null,
                modifier = null;

            if(sortNum != null) {
                f = headers[sortNum].sortFunction;
                modifier = this.state.sortDirection;
            }

            return items.sort((a,b)=>{
                if(f) {
                    return f(a,b) * modifier;
                }
                else {
                    if(a.createdAt>b.createdAt) {
                        return -1;
                    }
                    return 1;
                }
            });
        }
        return items;
    },

    setSort(sortNum) {
        let direction = 1;
        if(sortNum == this.state.selectedSortNum) {
            direction = this.state.sortDirection *= -1;
        }
        this.setState({
            selectedSortNum:sortNum,
            sortDirection:direction
        })
    },

	render(){
		//var requests = this.applySort(this.data.requests);
        var requests = this.data.requests;
        var headers = this.props.headers;
        var selectedSortNum = this.state.selectedSortNum;
        var sortDirection = this.state.sortDirection;
		return <div>

            {!headers?null:
                <div className="card-table-header issue-card-table-header">
                {headers.map((i,idx)=>{
                    return <div 
                        key={idx}
                        onClick={()=>{this.setSort(idx)}} 
                        style={{color:(idx==selectedSortNum)?'#000':'#999'}}  
                        className={"issue-summary-col issue-summary-col-"+(idx+1)}
                    >
                    <div>{i.text}</div>
                    {
                        idx == selectedSortNum ? <div className="sort-button">
                            <i className={"fa fa-caret-"+(sortDirection==1?"down":"up")}></i>
                        </div>
                        :null
                    }                    
                    </div>
                })}
                </div>
            }

			{requests&&requests.length?requests.map((r,idx)=>{
				return (
					<div className="grid-item" 
                        key={idx} 
                        style={{height:"48px",paddingTop:"5px"}} 
                        onClick={()=>{FABActions.viewRequest(r)}}
                    >
						<IssueSummary item={r}/>
					</div>
				)
			}):null}

		</div>
	}
})