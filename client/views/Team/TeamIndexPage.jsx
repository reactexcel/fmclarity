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
        	team : team,
            members : members,
            facilities : facilities
        }
    },

    showModal(selectedUser) {
        Modal.show({
            content:<UserProfile />
        })
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
  					<FilterBox2 
						items={this.data.members}
						newItemCallback={this.showModal}
						itemView={{
							summary:ContactCard,
							detail:UserProfileWidget
						}}
					/>
				</div>
			</div>
		);
	}
})