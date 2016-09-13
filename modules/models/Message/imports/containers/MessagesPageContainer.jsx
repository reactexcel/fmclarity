import React from "react";

import Messages from '../models/Messages.jsx';
import MessagesPage from '../components/MessagesPage.jsx';
import { createContainer } from 'meteor/react-meteor-data';

export default MessagesPageContainer = createContainer( ( params ) => {
	Meteor.subscribe( 'Teams' );
	Meteor.subscribe( 'Files' );
	Meteor.subscribe( 'Messages' );
	return {
		messages: Messages.find().fetch()
	}
}, MessagesPage );
