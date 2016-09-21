import React from 'react';
import { mount } from 'react-mounter';

import { Route } from '/modules/core/Actions';
import { AccessGroups } from '/modules/core/Authentication';
import { MainLayout, BlankLayout } 	from '/modules/core/Layouts';

import CompliancePageIndex from './imports/components/CompliancePageIndex.jsx';

AccessGroups.loggedIn.add( {
	name: 'abc',
	path: '/abc',
	label: "Compliance",
	icon: 'fa fa-check-square-o',
	action() {
		mount( MainLayout, {
			content: <CompliancePageIndex />
		} );
	}
} );