UsersPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe('users');
        var users = Users.find({},{sort:{'emails[0]':-1}}).fetch();
        var items = [];
        users.map(function(i,idx){
        	items[idx] = {
        		email : i.emails[0]
        	}
        	for(var key in i.profile) {
        		var val = i.profile[key];
        		items[idx][key] = val;
        	}
        });
        return {
            items : items
        }
    },

	render() {
		// okay - so we really need to pass in a function here
		// seeing as this class is the only one aware of the 
		// structure of the data being sent in
		var filters = [
	      {
	        text:"All"
	      },
	      {
	        text:"Expired"
	      },
	      {
	        text:"Incomplete",
	        filter(i) {
	        	return i.clientExecuted==false;
	        }
	      }
	    ];
		return(
			<div>
		        <div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"60px"}}>
		          <div className="col-lg-12">
		            <h2 style={{marginTop:"16px"}}>Contacts</h2>
		          </div>
		        </div>
		        <div className="contacts-page wrapper wrapper-content animated fadeIn">
					<FilterBox 
						items={this.data.items}
						filters={filters}
						numCols={2}
						itemView={{
							summary:ContactSummary,
							detail:ContactSummary
						}}
					/>
				</div>
			</div>
		);
	}
})