TeamPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('users');

        var user,team,members,facilities;
        user = Meteor.user();
        if(user) {
            team = user.getSelectedTeam();
            if(team) {
                members = team.getMembers();
                facilities = team.getFacilities();
            }
        }
        return {
        	team : team||[],
            members : members||[],
            facilities : facilities||[]
        }
    },

    handleInvite(e) {
    	var team = this.data.team;
    	e.preventDefault();
    	var input = this.refs.invitationEmail;
    	var email = input.value;
    	var re = /.+@.+\..+/i
    	if(!re.test(email)) {
    		alert('Please enter a valid email address');
    	}
    	else {
            input.value = '';
            team.inviteMember(email);
	    }
    },

    handleAddFacility(e) {
        var team = this.data.team;
        e.preventDefault();
        var input = this.refs.facilityName;
        var name = input.value;
        var re = /.*/i
        if(!re.test(name)) {
            alert('Please enter a valid facility name');
        }
        else {
            input.value = '';
            team.addFacility({name:name});
        }
    },

	render() {
		// okay - so we really need to pass in a function here
		// seeing as this class is the only one aware of the 
		// structure of the data being sent in
		return(
			<div>
		        <div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"60px"}}>
		          <div className="col-lg-12">
		            <h2 style={{marginTop:"16px"}}>Team Members</h2>
		          </div>
		        </div>
		        <div className="contacts-page wrapper wrapper-content animated fadeIn">
                    <form className="form-inline" style={{position:"absolute",zIndex:2000,margin:"7px"}}>
                        <div className="form-group">
                            <label>Invite users</label>
                            <input style={{borderRadius:"30px"}} type="email" className="form-control" ref="invitationEmail" placeholder="Email address"/>
                            <button type="submit" style={{width:0,opacity:0}} onClick={this.handleInvite}>Invite</button>
                        </div>
                    </form>
  					<FilterBox2 
						items={this.data.members}
						itemView={{
							summary:ContactCard,
							detail:UserProfile
						}}
					/>
				</div>
			</div>
		);
	}
})