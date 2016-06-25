import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


RequestsPageIndex = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('contractors');
        Meteor.subscribe('services');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        Meteor.subscribe('users');
	    var issues;
	    var user = Meteor.user();
	    var team = Session.getSelectedTeam();
	    if(user&&team) {
		    var facility = Session.getSelectedFacility();

		    var q = {};
		    if(facility) {
		        q['facility._id'] = facility._id;
		    }

	    	issues = user.getRequests(q);
	    }
        return {
            issues : issues,
            team : team
        }
    },

    createNewIssue(callback) {
        var selectedFacility = Session.getSelectedFacility();
        var selectedTeam = Session.getSelectedTeam();
        var issue = {
        	costThreshold:selectedTeam.defaultWorkOrderValue
        }
        if(selectedTeam) {
    		issue.team = {
    			_id:selectedTeam._id,
	    		name:selectedTeam.name
	    	}
        }
        if(selectedFacility) {
	    	issue.facility = {
	    		_id:selectedFacility._id,
	    		name:selectedFacility.name
	    	}
	    }
	    //console.log(issue);
	    Meteor.call('Issues.create',issue,function(err,response){
	    	if(err) {
	    		console.log(err);
	    	}
	    	if(callback&&response) {
	    		var newItem = Issues.findOne(response._id);
	    		//console.log(newItem);
	    		callback(newItem);
	    	}
	    });
	    //Issues.create(issue,callback);
    },

    exportIssues(issues) {
    	var projection = [];
    	issues.map(function(issue,index){
    		if(issue.status!="New"&&!issue.exported) {
	    		var newElement = {
	    			code:issue.code,
	    			name:issue.name,
	    			facility:issue.facility.name,
	    			description:issue.description,
	    			amount:'$'+issue.costThreshold,
	    			supplier:issue.supplier.name,
	    			"date created":issue.createdAt,
	    			"date issued":issue.issuedAt
	    		}
	    		projection.push(newElement);
	    		issue.exported = true;
	    		issue.save();
	    	}
    	});
    	var csv = Papa.unparse(projection);
		var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "fm-clarity-export.csv");
    },

	render() {
		var team = this.data.team;
		var filters = [
	    {
	        text:"Open",
	        filter(i) {
	        	return i.status=='Draft'||i.status=='New'||i.status=='Issued';
	        }
	    },
	    {
	        text:"Closed",
	        filter(i) {
	        	return i.status=='Draft'||i.status=='Closed';
	        }
	    }
	    /*
	    {
	        text:"Not exported",
	        filter(i) {
	        	return !i.exported;
	        }
	    }
	    */
	    ];

	    var headers = [
	    {
	    	text:"Priority",
	    	sortFunction(a,b) {
	    		var weight = {'Closed':0,'Scheduled':1,'Standard':2,'Urgent':3,'Critical':4};
	    		return	(weight[a.priority]<weight[b.priority])?-1:1;
	    	},
	    },
	    {
	    	text:"Status",
	    	sortFunction(a,b) {
	    		var weight = {'New':0,'Issued':1,'Closed':2};
	    		return	(weight[a.status]<weight[b.status])?-1:1;
	    	},
	    },
	    {
	    	text:"Facility",
	    	sortFunction(a,b) {
	    		return (a.facility.name<b.facility.name)?-1:1;
	    	},
	    },
	    {
	    	text:(team&&team.type=="contractor")?"Client":"Supplier",
	    	sortFunction(a,b) {
	    		if(!b.supplier) {
	    			return 1;
	    		}
	    		else if(!a.supplier) {
	    			return -1;
	    		}
	    		else {
		    		return (a.supplier.name>b.supplier.name)?-1:1;
		    	}
	    	},
	    },
	    {
	    	text:"Due",
	    	sortFunction(a,b) {
	    		if(!b.dueDate) {
	    			return 1;
	    		}
	    		else if(!a.dueDate) {
	    			return -1;
	    		}
	    		else {
		    		return (a.dueDate>b.dueDate)?-1:1;
		    	}
	    	},
	    },
	    {
	    	text:"Issued",
	    	sortFunction(a,b) {
	    		if(!b.issuedAt) {
	    			return 1;
	    		}
	    		else if(!a.issuedAt) {
	    			return -1;
	    		}
	    		else {
		    		return (a.issuedAt>b.issuedAt)?-1:1;
		    	}
	    	},
	    },	    
	    {
	    	text:"Issue",
	    	sortFunction(a,b) {
	    		return (a.name<b.name)?-1:1;
	    	},
	    },
	    ];
		return(
			<div>
		        <div className="row wrapper page-heading">
		          <div className="col-lg-12">
                    <FacilityFilter title="Requests"/>
		          </div>
		        </div>
		    	{/*newItemCallback could be a collection helper - then we pass in the collection to the filterbox*/}
		        <div className="issue-page wrapper wrapper-content animated fadeIn">
					<FilterBox 
						items={this.data.issues}
						filters={filters} 
						headers={headers}
						itemView={{
							summary:IssueSummary,
							detail:IssueDetail
						}}
						newItemCallback={team&&team.type=="fm"?this.createNewIssue:null}
						exportCallback={this.exportIssues}
					/>
				</div>
			</div>
		);
	}
})