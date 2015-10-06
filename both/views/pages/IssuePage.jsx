PageRequests = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe('issues');
        return {
            issues : Issues.find({},{
            	sort:{createdAt:-1}
            }).fetch()
        }
    },

    createNewIssue() {
    	Meteor.call("Issue.new");
    },

	render() {
		var filters = [
	      {
	        text:"All"
	      },
	      {
	        text:"Urgent",
	        filter(i) {
	        	return i.urgent;
	        }
	      },
	      {
	        text:"New",
	        filter(i) {
	        	return i.status=='New';
	        }
	      },
	      {
	        text:"Open",
	        filter(i) {
	        	return i.status=='Open';
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
		        <div className="issue-page wrapper wrapper-content animated fadeIn">
					<FilterBox 
						items={this.data.issues}
						filters={filters} 
						card={OrderCard}
						newItemCallback={this.createNewIssue}
						header={OrderCardTableHeader}
					/>
				</div>
			</div>
		);
	}
})