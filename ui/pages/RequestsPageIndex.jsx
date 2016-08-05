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
	    var facility, q;
	    if(user&&team) {
		    facility = Session.getSelectedFacility();

		    q = {};
		    if(facility) {
		        q['facility._id'] = facility._id;
		    }

	    	issues = user.getRequests(q,{expandPMP:true});
	    }
        return {
        	filter:q,
            issues : issues,
            team : team
        }
    },

	render() {
		var team = this.data.team;
		var filters = [
	    {
	        text:"Open",
	        filter(i) {
	        	return i.status!='Closed'
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
		        <FacilityFilter/>
		        <div className="issue-page animated fadeIn" style={{paddingTop:"50px"}}>
		        	<RequestsTable filter={this.data.filter}/>
				</div>
			</div>
		);
	}
})