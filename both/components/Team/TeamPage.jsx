TeamPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('teams');
        Meteor.subscribe('users');
        Meteor.subscribe('facilities');

        var tid,team,members,facilities;
        tid = Session.get("selectedTeam")._id;
        team = Team.findOne(tid);
        if(team) {
            members = team.getMembers();
            members = this.processUsers(members);
            facilities = team.getFacilities();
        }
        
        return {
        	team : team||[],
            members : members||[],
            facilities : facilities||[]
        }
    },

    processUsers(users) {
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
        return items;
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
						items={this.data.members}
						numCols={2}
						itemView={{
							summary:ContactSummary,
							detail:ContactSummary
						}}
					/>
                    <form className="form-inline">
                        <div className="form-group">
                            <label>Invite users</label>
                            <input type="text" className="form-control" ref="facilityName" placeholder="Facility name"/>
                            <button type="submit" style={{width:0,opacity:0}} onClick={this.handleAddFacility}>Invite</button>
                        </div>
                    </form>
                    <FilterBox 
                        items={this.data.facilities}
                        itemView={{
                            summary:FacilitySummary,
                            detail:FacilityDetail
                        }}
                    />
				</div>
			</div>
		);
	}
})