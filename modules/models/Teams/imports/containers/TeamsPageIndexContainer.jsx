import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Teams } from '/modules/models/Teams';

import TeamsPageIndex from '../components/TeamsPageIndex.jsx';

export default TeamsPageIndexContainer = createContainer( ( params ) => {
	return {
		teams: Teams.findAll()
	}
}, TeamsPageIndex );
