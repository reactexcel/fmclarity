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

	console.log( TopNavigationBar );

	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Messages' );
	Meteor.subscribe( 'Notifications' );

	//Meteor.subscribe('notifications');
	let user = Meteor.user(),
		team = null,
		teams = null,
		role = null,
		notifications = null;

	if ( user ) {

		team = user.getTeam();
		teams = user.getTeams();
		if ( !teams || !teams.length ) {} else if ( !team ) {
			team = teams[ 0 ];
			user.selectTeam( team );
		} else if ( !team.name && !this.showingModal ) {
			this.showingModal = true;
			TeamActions.edit.run( team );
		}

    	function showNotification( title, body ) {
        	notify.createNotification( title, {
            	body: body,
            	icon: "icon-64x64.ico"
        	} );
    	}		

		notifications = Notifications.findAll( { 'recipient._id': user._id, read: false } );
		var count = notifications.length;
		if ( count > this.oldCount ) {
			this.oldCount = count;
			if ( notifications && notifications.length ) {
				this.audio.play();
				var suppressFurtherNotifications = false;
				if ( notifications.length > 2 ) {
					showNotification(
						"You have FM Clarity notifications",
						"You have more than 3 new notifications from FM Clarity"
					);
					suppressFurtherNotifications = true;
				} else {
					notifications.map( ( n ) => {
						if ( !this.shown[ n._id ] ) {
							this.shown[ n._id ] = true;
							if ( !suppressFurtherNotifications ) {
								showNotification( n.subject, n.body );
							}
						}
					} )
				}
			}
		}
	}

	function onNotificationsViewed() {
		let user = Meteor.user();
		if( user ) {
			Notifications.update( { 'recipient._id': user._id }, { $set: { read: true } } );
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
