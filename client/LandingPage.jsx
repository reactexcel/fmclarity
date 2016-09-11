import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

// Landing page
// A minimal page which uses the ReactMeteorData mixin to load user information
// and determine where to redirect for landing
//
// Notes: 
// 1. Note that this page does not render anything in itself but simply uses the ReactMeteorData loading
//    mechanism to redirect. In a way this is a non-idiomatic use of React which is primarily used for interface elements
//    The more logical place for this functionaliy is in the router but then we can't draw on ReactMeteorData for reactive updates.
LandingPage = React.createClass(
{

    mixins: [ ReactMeteorData ],

    getMeteorData()
    {
        var user, team, role;
        user = Meteor.user();
        team = Session.getSelectedTeam();
        if ( user && team )
        {
            role = team.getMemberRole( user );
        }
        if ( role )
        {
            var modules = Config.modules[ team.type ][ role ];
            var landing = modules && modules.length ? modules[ 0 ].path : null;
            if ( landing )
            {
                //perform the redirect
                FlowRouter.go( '/' + landing );
            }
        }
        return {
            user: user,
            team: team,
            role: role
        }
    },

    render()
    {
        return <div/>
    }
} )
