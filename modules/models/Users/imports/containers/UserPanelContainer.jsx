/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Users } from '/modules/models/Users';

import UserPanel from '../components/UserPanel.jsx';

export default UsersPageContainer = createContainer( ( props ) => {
	console.log(props);
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Users' );
	Meteor.subscribe( 'Facilities' );
	Meteor.subscribe( 'Files' );
	return {
		item 	:  props.item,
		team 	:  props.team,
		role 	:  props.role,
		group	:  props.group,
	}
}, UserPanel );
