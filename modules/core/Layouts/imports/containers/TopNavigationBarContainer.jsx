/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { TopNavigationBar } from '/modules/ui/MaterialNavigation';
import { TeamActions } from '/modules/models/Teams';
//import { Notifications } from '/modules/models/Notifications';

/**
 * @class 			TopNavigationBarContainer
 * @memberOf 		module:core/Layouts
 */
const TopNavigationBarContainer = createContainer( ( { params } ) => {

	Meteor.subscribe( 'User: Teams' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Teams' );
	
	////////////////////////////////////////
	//Meteor.subscribe( 'Request: Files' );
	//Meteor.subscribe( 'Document: Files' );
	////////////////////////////////////////

	Meteor.subscribe( 'User: Messages' );
	Meteor.subscribe( 'User: Requests, Facilities', {});	

	/*These need to be reduced*/
	Meteor.subscribe( 'Documents' );
	Meteor.subscribe( 'Files' );

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
		}

		//subscribe to team specific guff here

		// get notifications
		notifications = Messages.findAll( { 'inboxId.query._id': user._id }, { sort: { createdAt:-1 }, limit: 20 } );
		unreadCount = Messages.find( { 'inboxId.query._id': user._id, read: false } ).count();

//		let unshownNotifications = _.filter( notifications, ( n ) => { return !n.wasShown } );
	//	if ( unshownNotifications.length ) {
		//	chime.play();
	//		showNotifications( unshownNotifications );
//		}
	}

	function showNotifications( notifications ) {
		notifications.map( ( notification ) => {
			notify.createNotification( notification.getSubject(), {
				body: notification.getBody(),
				icon: "icon-64x64.ico"
			} );
			Meteor.call( 'Notifications.setShown', notification );
		} )
	}

	function onNotificationsViewed() {
		let user = Meteor.user();
		if ( user ) {
			Meteor.call( 'Notifications.markAsRead', { user } );
		}
	}

	return {
		user,
		team,
		teams,
		notifications,
		unreadCount,
		onNotificationsViewed,
		showNotifications,
	}

}, TopNavigationBar );

export default TopNavigationBarContainer;
