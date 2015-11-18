PageRequests = React.createClass({

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

    createNewIssue() {
        var selectedFacility = Meteor.user().getSelectedFacility();
        if(selectedFacility) {
	    	Meteor.call("Issue.new",{
	    		_facility:{
	    			_id:selectedFacility._id,
	    			name:selectedFacility.name
	    		},
	    		_team:selectedFacility._team
	    	});
	    }
    },

	render() {
		var filters = [
	    {
	        text:"All"
	    },
	    {
	        text:"Urgent",
	        filter(i) {
	        	return i.priority=='Urgent';
	        }
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
	    	text:"Creator",
	    	sortFunction(a,b){
	    		if(!a._creator||!a._creator.name) {
	    			return -1;
	    		}
	    		else if(!b._creator||!b._creator.name) {
	    			return 1;
	    		}
	    		else if	(a._creator.name<b._creator.name){
	    			return -1;
		    	}
		    	else if (a.cratedAt<b.createdAt) {
		    		return -1;
		    	}
		    	else {
		    		return 1;
		    	}
	    	},
	    },
	    {
	    	text:"Supplier",
	    	sortFunction(a,b) {
	    		if(!a._supplier||!a._supplier.name) {
	    			return -1;
	    		}
	    		else if(!b._supplier||!b._supplier.name) {
	    			return 1;
	    		}
	    		else if	(a._supplier.name<b._supplier.name){
	    			return -1;
		    	}
		    	else if (a.cratedAt<b.createdAt) {
		    		return -1;
		    	}
		    	else {
		    		return 1;
		    	}
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
	    		return (a._facility.name<b._facility.name)?-1:1;
	    	},
	    },
	    {
	    	text:"Issue",
	    	sortFunction(a,b) {
	    		return (a.name<b.name)?-1:1;
	    	},
	    },
	    {
	    	text:"Updated",
	    	sortFunction(a,b) {
	    		return (a.createdAt>b.createdAt)?-1:1;
	    	},
	    }
	    ];
		return(
			<div>
		        <div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"60px"}}>
		          <div className="col-lg-12">
		            <h2 style={{marginTop:"16px"}}>Work Requests</h2>
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