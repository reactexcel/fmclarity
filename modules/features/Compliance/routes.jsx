import React from 'react';
import { mount } from 'react-mounter';

import { Route } from '/modules/core/Actions';
import { AccessGroups } from '/modules/core/Authentication';
import { LayoutMain, LayoutBlank } from '/modules/core/Layouts';

import CompliancePageIndexContainer from './imports/containers/CompliancePageIndexContainer.jsx';

AccessGroups.loggedIn.add( {
	name: 'abc',
	path: '/abc',
	label: "Compliance",
	icon: 'fa fa-check-square-o',
	action() {
		mount( LayoutMain, {
			content: <CompliancePageIndexContainer />
		} );
	}
} );
