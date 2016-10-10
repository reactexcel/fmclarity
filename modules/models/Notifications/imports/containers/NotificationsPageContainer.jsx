/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Notifications } from '/modules/models/Notifications';
import NotificationsPage from '../components/NotificationsPage.jsx';

/**
 * @class 			NotificationsPageContainer
 * @memberOf 		module:models/Notifications
 */
const NotificationsPageContainer = createContainer( ( { params } ) => {
	Meteor.subscribe ( 'Notifications' );
	let items = Notifications.findAll();
	return {
		items
	}
}, NotificationsPage );

export default NotificationsPageContainer;