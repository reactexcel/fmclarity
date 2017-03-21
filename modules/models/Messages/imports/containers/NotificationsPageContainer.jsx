/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Messages } from '/modules/models/Messages';
import NotificationsPage from '../components/NotificationsPage.jsx';

/**
 * @class 			NotificationsPageContainer
 * @memberOf 		module:models/Notifications
 */
const NotificationsPageContainer = createContainer( ( { params } ) => {
	let user = Meteor.user(),
		notifications = [];

	if( user ) {
		notifications = Messages.findAll( { 'inboxId.query._id': user._id }, { sort: { createdAt:-1 } } );
	}

	return {
		items: notifications
	}
}, NotificationsPage );

export default NotificationsPageContainer;