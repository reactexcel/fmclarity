/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Teams } from '/modules/models/Teams';
import { Users } from '/modules/models/Users';

import moment from 'moment';


/**
 * UI Component that renders an invitation sent to a team member
 * @class           TeamPageProfile
 * @memberOf        module:models/Teams
 */
const TeamInviteEmailTemplate = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var team,user,secret,expiry;

        //console.log( this.props );

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
    	var url = Meteor.absoluteUrl('enroll-account/'+ secret, {rootUrl: "https://app.fmclarity.com"});
        var userName = (user.profile&&user.profile.firstName)?user.profile.firstName:user.getName();
        var role = user.getRole() ? user.getRole() : 'member';

        return(
            <div>
                <p>Hi {userName},</p>

                <p>

	                {team.getName()} has set up FM Clarity web-based software to make it easy to manage facility processes.<br/>
					As a {role} of {team.getName()}, an account has been created for you to give you access to the system.<br/><br/>
					Quick info: what do I need to do to get setup?<br/><br/>
					1. Click the link at the bottom of this email<br/>
					2. Change your password<br/><br/>
					<a href={url}>{url}</a>

				</p>
            </div>
        )
    }
});

export default TeamInviteEmailTemplate;
