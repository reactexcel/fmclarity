TeamProfilePage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var user, team;
    	user = Meteor.user();
    	if(user) {
    		team = user.getSelectedTeam();
    	}
		return {
			team:team
		}
	},

	render() {
		if(!this.data.team) {
			return <div/>
		}
		return (
		    <div className="wrapper wrapper-content animated fadeIn">
		        <div className="row">
		            <div className="col-lg-6">
						<TeamCard
							item={this.data.team}
						/>
					</div>
				</div>
			</div>
		)
	}
})
