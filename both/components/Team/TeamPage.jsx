TeamPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe('accounts');
        Meteor.subscribe('users');
        var account = this.account = FMAccounts.findOne({
        	name:"Lucky 12"
        });
        console.log(account);
        var users = account?account.getTeam():[];
        console.log(users);
        var items = [];
        users.map(function(i,idx){
        	items[idx] = {
        		_id: i._id,
        		email : i.emails[0].address
        	}
        	for(var key in i.profile) {
        		var val = i.profile[key];
        		items[idx][key] = val;
        	}
        });
        return {
        	account:account,
            items : items
        }
    },

    handleInvite(e) {
    	var account = this.account;
    	e.preventDefault();
    	var input = this.refs.invitationEmail;
    	console.log(input);
    	var email = input.value;
    	var re = /.+@.+\..+/i
    	if(!re.test(email)) {
    		alert('Please enter a valid email address');
    	}
    	else {
    		Meteor.call('inviteUser', email,function(error,result){
    			console.log({
    				error:error,
    				result:result
    			});
    			account.addMember(result);
    		});
	    	//alert(email);
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
<form className="form-inline">
  <div className="form-group">
    <label>Invite users</label>
    <input type="email" className="form-control" ref="invitationEmail" placeholder="Email address"/>
    <button type="submit" style={{width:0,opacity:0}} onClick={this.handleInvite}>Invite</button>
  </div>
  </form>
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