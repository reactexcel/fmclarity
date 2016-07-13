import React from "react";
import {ReactMeteorData} from 'meteor/react-meteor-data';
import ActionsMenu from 'meteor/fmc:actions-menu';


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
            if(item.service) {
                return {val:item.service.name+(item.subservice?(" - "+item.subservice.name):"")};
            }
        },
        "Location":function(item) {
            if(item.level) {
                return {val:item.level.name+(item.area?(" - "+item.area.name):"")};
            }
        },
    	"Due":"dueDate",
    	"Completed":"closeDetails.completionDate",
    	"Responsiveness":function(item) {
            if(!item.closeDetails||item.closeDetails.completionDate==null||item.closeDetails.completionDate=="") {
                return;
            }

    		var start = moment(item.dueDate);
    		var end = moment(item.closeDetails.completionDate);
            var duration = moment.duration(start.diff(end));
    		if(duration) {
                var val = {};
                val.originalVal = parseInt(duration.asMinutes());
                val.val = duration.humanize();
                if(val.originalVal<0) {
                    val.val = ("- "+val.val);
                    val.style={color:"red"};
                }
                return val;
	    	}
    	},
    	"Amount ($)":function(item) {
            var val = item.costThreshold||0;
            if(val) {
                val = parseFloat(val);
                if(isNaN(val)) {
                    val = 0;
                }
            }
            return {
                originalVal:val,
                val:val.toFixed(2),
                style:{textAlign:"right"}
            }
        }
    },

    getInitialState() {
        return {
            service:null,
            startDate:null,
            endDate:null
        }
    },

    getMeteorData() {
        Meteor.subscribe('teamsAndFacilitiesForUser');
        Meteor.subscribe('users');
       	var user, team, facility, requests, data={};
    	user = Meteor.user();
    	if(user) {
            var q = {};
	    	team = user.getSelectedTeam();
            facility = user.getSelectedFacility();
            service = this.state.service;
            if(facility) {
                q["facility._id"] = facility._id;
            }
            if(service) {
                q["service.name"] = service.name;
            }
            if(this.state.startDate||this.state.endDate) {
                q.issuedAt = {};
            }
            if(this.state.startDate) {
                q.issuedAt.$gte = this.state.startDate;
            }
            if(this.state.endDate) {
                q.issuedAt.$lte = this.state.endDate;
            }
	    	if(team) {
		    	data.requests = user.getRequests(q);
		    }
    	}
    	return {
    		team:team,
            facility:facility,
    		reportData:data
    	}
    },

    handleFacilityChange(facility) {
        Session.selectFacility(facility);
        this.handleServiceChange(null);
    },

    handleTeamChange(team) {
        Session.selectTeam(team);
    },

    handleServiceChange(service) {
        this.setState({
            service:service
        })
    },

    handleStartChange(startDate) {
        this.setState({
            startDate:startDate
        })
    },

    handleEndChange(endDate) {
        this.setState({
            endDate:endDate
        })
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
                    <div className="row">
                        <div className="col-md-4">
                            <TeamPicker onChange={this.handleTeamChange}/>
                        </div>
                        <div className="col-md-4">
                            <FacilityPicker onChange={this.handleFacilityChange}/>
                        </div>
                        <div className="col-md-4">
                            <ServicePicker value={this.state.service} onChange={this.handleServiceChange}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <AutoInput.MDDateTime placeholder="Start Date" onChange={this.handleStartChange}/>
                        </div>
                        <div className="col-md-4">
                            <AutoInput.MDDateTime placeholder="End Date" onChange={this.handleEndChange}/>
                        </div>

                    </div>

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