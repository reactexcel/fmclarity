/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { TopNavigationBar } from '/modules/ui/MaterialNavigation';
import { TeamActions } from '/modules/models/Teams';

/**
 * @class 			TopNavigationBarContainer
 * @memberOf 		module:core/Layouts
 */
const TopNavigationBarContainer = createContainer( ( { params } ) => {
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

		notifications = Notifications.findAll();
		var count = notifications.length;
		if ( count > this.oldCount ) {
			this.oldCount = count;
			if ( notifications && notifications.length ) {
				this.audio.play();
				var suppressFurtherNotifications = false;
				if ( notifications.length > 2 ) {
					this.showNotification(
						"You have FM Clarity notifications",
						"You have more than 3 new notifications from FM Clarity"
					);
					suppressFurtherNotifications = true;
				} else {
					notifications.map( ( n ) => {
						if ( !this.shown[ n._id ] ) {
							this.shown[ n._id ] = true;
							if ( !suppressFurtherNotifications ) {
								this.showNotification( n.subject, n.body );
							}
						}
					} )
				}
			}
		}
	}
	return {
		user,
		team,
		teams,
		notifications
	}
}, TopNavigationBar );

export default TopNavigationBarContainer;