UpdatesWidget = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var user,team;
    	user = Meteor.user();
    	if(user) {
    		team = user.getSelectedTeam();
    	}
    	return {
    		user:user,
    		team:team
    	}
    },

	render() {
	    return (
	    	<div>
		        {/*<ActionsMenu items={this.getMenu()} icon="eye" />*/}
		        <div className="ibox-title">
		        	<h2>Recent Updates</h2>
		        </div>
		        <div className="ibox-content">
		        	{this.data.team?
					<Inbox for={this.data.team} truncate={true} readOnly={true}/>
		        	:null}
				</div>
			</div>
	    )
	}
})