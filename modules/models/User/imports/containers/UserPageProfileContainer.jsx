import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Users } from '/modules/models/User';

import UserPageProfile from '../components/UserPageProfile.jsx';

export default UserPageProfileContainer = createContainer( ( params ) => {
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Files' );
	return {
		user: Meteor.user()
	}
}, UserPageProfile );
