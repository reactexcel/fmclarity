/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { TopNavigationBar } from '/modules/ui/MaterialNavigation';
import { TeamActions } from '/modules/models/Teams';
import { Notifications } from '/modules/models/Notifications';

/**
 * @class 			TopNavigationBarContainer
 * @memberOf 		module:core/Layouts
 */
const TopNavigationBarContainer = createContainer( ( { params } ) => {

	let user = Meteor.user(),
		team = null,
		teams = null,
		role = null,
		notifications = null,
		chime = new Audio( '/audio/alert3.wav' );

	if ( user ) {

		// select initial team
		team = user.getTeam();
		teams = user.getTeams();
		if ( !teams || !teams.length ) {} else if ( !team ) {
			team = teams[ 0 ];
			user.selectTeam( team );
			// if user has no teams then this is most likely first visit after account creation
			//  so prompt to create team
		} else if ( !team.name && !this.showingModal ) {
			this.showingModal = true;
			TeamActions.edit.run( team );
		}

		// get notifications
		notifications = Messages.findAll( { 'inboxId.query._id': user._id, read: false } );
		let unshownNotifications = _.filter( notifications, ( n ) => { return !n.wasShown } );
		if ( unshownNotifications.length ) {
			chime.play();
			showNotifications( unshownNotifications );
		}
	}

	function showNotifications( notifications ) {
		notifications.map( ( notification ) => {
			notify.createNotification( notification.subject, {
				body: notification.body,
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
		onNotificationsViewed
	}

}, TopNavigationBar );

export default TopNavigationBarContainer;
