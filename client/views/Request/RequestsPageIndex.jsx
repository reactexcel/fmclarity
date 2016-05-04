IssuesIndexPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('contractors');
        Meteor.subscribe('services');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        Meteor.subscribe('users');
	    var issues;
    	if(Meteor.user()) {
	        var facility = Session.getSelectedFacility();
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

	componentWillUnmount() {
		var items = this.data.issues;
	    if(items) {
	    	items.map(function(item){
	    		if(item.isNew()) {
	        		//item.destroy();
	        	}
	      	})
	    }
	},    

    createNewIssue(callback) {
        var selectedFacility = Meteor.user().getSelectedFacility();
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
	    Meteor.call('Issues.create',issue,function(err,response){
	    	if(err) {
	    		console.log(err);
	    	}
	    	if(callback&&response) {
	    		var newItem = Issues.findOne(response._id);
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
		var filters = [
	    {
	        text:"Open",
	        filter(i) {
	        	return i.status!='Closed'&&i.status!='Reversed';
	        }
	    },
	    {
	        text:"New",
	        filter(i) {
	        	return i.status=='Draft'||i.status=='New';
	        }
	    },
	    {
	        text:"Issued",
	        filter(i) {
	        	return i.status=='Draft'||i.status=='Issued';
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
						newItemCallback={this.createNewIssue}
						exportCallback={this.exportIssues}
					/>
				</div>
			</div>
		);
	}
})