LandingPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var user,team,role;
    	user = Meteor.user();
    	team = Session.getSelectedTeam();
    	if(user&&team) {
    		role = team.getRole(user);
    	}
        if(role) {
            var modules = Config.modules[team.type][role];
            var landing = modules&&modules.length?modules[0].path:null;
            if(landing) {
                FlowRouter.go('/'+landing);
            }
        }        
    	return {
    		user:user,
    		team:team,
    		role:role
    	}
    },

	render() {
		return <div/>
	}
})