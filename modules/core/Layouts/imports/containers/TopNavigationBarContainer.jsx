/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { TopNavigationBar } from '/modules/ui/MaterialNavigation';
import { Teams, TeamActions } from '/modules/models/Teams';

/**
 * @class 			TopNavigationBarContainer
 * @memberOf 		module:core/Layouts
 */
const TopNavigationBarContainer = createContainer( ( { params } ) => {

    Meteor.subscribe( 'User: Teams' );
    Meteor.subscribe( 'Users' );

    ////////////////////////////////////////
    //Meteor.subscribe( 'Request: Files' );
    //Meteor.subscribe( 'Document: Files' );
    ////////////////////////////////////////

    Meteor.subscribe( 'User: Messages' );
    // could test moving this below loading team and only including facilities if supplier
    Meteor.subscribe( 'Request: Last 10 Complete' );
    Meteor.subscribe( 'Request: Last 10 Cancelled' );
    Meteor.subscribe( 'Team: Last 10 Created' );

    if (!window.matchMedia("(min-width: 768px)").matches) {  
        Meteor.subscribe( 'Teams' );
        Meteor.subscribe( 'Reports' );
        Meteor.subscribe( 'Documents' );
        Meteor.subscribe( 'PPM_Schedulers' );
        Meteor.subscribe( 'Files' );
    }

    let user = Meteor.user(),
        team = null,
        teams = null,
        role = null,
        notifications = null,
        unreadCount = 0,
        chime = new Audio( '/audio/alert3.wav' );

    if ( user ) {

        // select initial team
        team = user.getTeam();
        teams = user.getTeams();
        if ( !teams || !teams.length ) {

        } else if ( !team ) {
            team = teams[ 0 ];
            user.selectTeam( team );
            // if user has no teams then this is most likely first visit after account creation
            //  so prompt to create team
        } else if ( !team.name && !this.showingModal ) {
            this.showingModal = true;
            TeamActions.edit.run( team );
        } else {
            Meteor.subscribe( 'Team: Facilities', team._id );
            // could team subscription be used to only includ facilities if supplier?
            let includeFacilities = Teams.isServiceTeam( team );
            Meteor.subscribe( 'User: Requests, Facilities', { teamId: team._id, includeFacilities } );
        }

        //subscribe to team specific guff here

        // get notifications
        notifications = Messages.findAll( { 'inboxId.query._id': user._id }, { sort: { createdAt: -1 }, limit: 20 } );
        unreadCount = Messages.find( { 'inboxId.query._id': user._id, read: false } ).count();

        //		let unshownNotifications = _.filter( notifications, ( n ) => { return !n.wasShown } );
        //	if ( unshownMessages.length ) {
        //	chime.play();
        //		showNotifications( unshownNotifications );
        //		}
    }

    function showNotifications( notifications ) {
        notifications.map( ( notification ) => {
            if( notification.wasShown || notification.inboxId.query._id == Meteor.user()._id ) {
                return;
            }
            notify.createNotification( notification.subject, {
                body: notification.body,
                icon: "icon-64x64.ico"
            } );
            Meteor.call( 'Messages.setShown', notification );
        } )
    }

    function onMessagesViewed() {
        console.log( 'marking notifications as viewed' );
        let user = Meteor.user();
        if ( user ) {
            Meteor.call( 'Messages.markAsRead', { user } );
        }
    }
    return {
        user,
        team,
        teams,
        notifications,
        unreadCount,
        onMessagesViewed,
        showNotifications,
    }

}, TopNavigationBar );

export default TopNavigationBarContainer;
