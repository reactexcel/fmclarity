import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

/*Well this is a bit of a hack isn't it?
Really should just go in the router hey?
But then can you load the relevent role information from router?*/

LandingPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var user,team,role;
    	user = Meteor.user();
    	team = Session.getSelectedTeam();
    	if(user&&team) {
    		role = team.getMemberRole(user);
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