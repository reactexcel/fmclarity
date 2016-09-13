import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Users } from '/modules/models/User';

import UsersPageIndex from '../components/UsersPageIndex.jsx';

export default UsersPageIndexContainer = createContainer( ( params ) => {
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Files' );
	return {
		users: Users.findAll()
	}
}, UsersPageIndex );