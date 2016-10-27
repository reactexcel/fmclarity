/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
 
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Users } from '/modules/models/Users';

import UserPageProfile from '../components/UserPageProfile.jsx';

/**
 * @class 			UserPageProfileContainer
 * @memberOf 		module:models/Users
 */
const UserPageProfileContainer = createContainer( ( params ) => {
	return {
		user: Meteor.user()
	}
}, UserPageProfile );

export default UserPageProfileContainer;
