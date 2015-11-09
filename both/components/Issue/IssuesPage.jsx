PageRequests = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
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
        var selectedFacility = Session.get("selectedFacility") || {
        	name:"Select Facility"
        };
    	Meteor.call("Issue.new",{_facility:selectedFacility});
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