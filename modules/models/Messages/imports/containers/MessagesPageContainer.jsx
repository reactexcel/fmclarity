import React from "react";
import { createContainer } from 'meteor/react-meteor-data';

import Messages from '../Messages.jsx';
import MessagesPage from '../components/MessagesPage.jsx';

export default MessagesPageContainer = createContainer( ( { params } ) => {
	return {
		messages: Messages.find().fetch()
	}
}, MessagesPage );
