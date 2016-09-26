/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Users } from '/modules/models/Users';

import UsersPageIndex from '../components/UsersPageIndex.jsx';

export default UsersPageIndexContainer = createContainer( ( params ) => {
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Files' );
	return {
		team: Session.getSelectedTeam(),
		users: Users.findAll()
	}
}, UsersPageIndex );
