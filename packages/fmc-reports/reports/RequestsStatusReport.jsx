import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

StatusReport = React.createClass({

    mixins: [ReactMeteorData],

    fields:{
    	"Issued":"issuedAt",
    	"PO#":"code",
    	"Status":"status",
    	"Priority":"priority",
    	"Issue":"name",
    	"Supplier":"supplier.name",
    	"Service":function(item){
            return item.service.name+(item.subservice?(" - "+item.subservice.name):"");
        },
        "Location":function(item) {
            return item.level.name+(item.area?(" - "+item.area.name):"");
        },
    	"Due":"dueDate",
    	"Completed":"closeDetails.completionDate",
    	"Responsiveness":function(item) {
    		var start = moment(item.dueDate);
    		var end = moment(item.closeDetails.completionDate);
    		var duration = moment.duration(end.diff(start));
    		if(duration) {
	    		return duration.humanize();
	    	}
    	},
    	"Amount":"costThreshold"
    },

    getMeteorData() {
        Meteor.subscribe('teamsAndFacilitiesForUser');
        Meteor.subscribe('users');
       	var user, team, requests, data={};
    	user = Meteor.user();
    	if(user) {
	    	team = user.getSelectedTeam();
	    	if(team) {
		    	data.requests = user.getRequests();
		    }
    	}
    	return {
    		team:team,
    		reportData:data
    	}
    },

	render() {
		var data = this.data.reportData.requests;
		if(!data) {
			return <div/>
		}
		return (
			<div>
				<div style={{padding:"15px"}} className="report-details">
					<h2>Status Report</h2>
					{this.data.team.name}

				</div>
				<DataGrid items={data} fields={this.fields}/>
			</div>
		)
	}
})

Reports.register({
	id:"requests-status",
	name:"Requests Status Report",
	content:StatusReport
})