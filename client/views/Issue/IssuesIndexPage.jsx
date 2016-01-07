IssuesIndexPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('contractors');
        Meteor.subscribe('services');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        Meteor.subscribe('users');
	    var issues;
    	if(Meteor.user()) {
	        var facility = Meteor.user().getSelectedFacility();
	        if(facility) {
	        	issues = facility.getIssues();
	        }
	        else {
	        	var team = Meteor.user().getSelectedTeam();
	        	if(team) {
	        		issues = team.getIssues();
	        	}
	        }
	    }
        return {
            issues : issues
        }
    },

    createNewIssue(callback) {
        var selectedFacility = Meteor.user().getSelectedFacility();
        var selectedTeam = Meteor.user().getSelectedTeam();
        var issue = {}
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
	    FM.create("Issue",issue,function(issue){
            issue.sendMessage({
                subject:"created work request"
            });
            if(callback) {
            	callback(issue);
            }	    	
	    });
    },

	render() {
		var filters = [
	    {
	        text:"All"
	    },
	    {
	        text:"New",
	        filter(i) {
	        	return i.status=='New';
	        }
	    },
	    {
	        text:"Issued",
	        filter(i) {
	        	return i.status=='Issued';
	        }
	    },
	    {
	        text:"Closed",
	        filter(i) {
	        	return i.status=='Closed';
	        }
	    }
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
	    	text:"Supplier",
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
	    	text:"Issue",
	    	sortFunction(a,b) {
	    		return (a.name<b.name)?-1:1;
	    	},
	    },
	    ];
		return(
			<div>
		        <div className="row wrapper border-bottom white-bg page-heading">
		          <div className="col-lg-12">
                    <FacilityFilter/>
		          </div>
		        </div>
		    	{/*newItemCallback could be a collection helper - then we pass in the collection to the filterbox*/}
		        <div className="issue-page wrapper wrapper-content animated fadeIn">
					<FilterBox 
						items={this.data.issues}
						filters={filters} 
						headers={headers}
						itemView={{
							header:IssueHeader,
							summary:IssueSummary,
							detail:IssueDetail
						}}
						newItemCallback={this.createNewIssue}
					/>
				</div>
			</div>
		);
	}
})