// should this perhaps go in FMCLoginTokens package?

import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

TeamInviteEmailTemplate = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var team,user,secret,expiry;
    	if(this.props.team) 
	    	team = Teams.findOne(this.props.team._id);
	    if(this.props.user)
	    	user = Users.findOne(this.props.user._id);
		if(this.props.token) {
            secret = this.props.token.token;
            expiry = this.props.token.expiry;
        }
        return {
        	team:team,
        	user:user,
        	secret:secret,
        	expiry:expiry
        }
    },

    render() {
    	var team = this.data.team;
    	var user = this.data.user;
    	var secret = this.data.secret;
    	var expiry = this.data.expiry?moment(this.data.expiry).fromNow():null;
    	var url = Meteor.absoluteUrl('enroll-account/'+ secret);
        var userName = (user.profile&&user.profile.firstName)?user.profile.firstName:user.getName();
        return(
            <div>
                <p>Hi {userName},</p>

                <p>

	                {team.getName()} has set up FM Clarity web-based software to make it easy to manage facility processes.<br/>
					As a member of the facility management team, an account has been created for you to give you access to the system.<br/><br/>
					Quick info: what do I need to do to get setup?<br/><br/>
					1. Click the link at the bottom of this email<br/>
					2. Change your password<br/>
					3. Follow the walkthrough<br/><br/>
					<a href={url}>{url}</a>

				</p>
            </div>
        )
    }
});