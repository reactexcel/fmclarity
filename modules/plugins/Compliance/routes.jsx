import React from 'react';
import { mount } from 'react-mounter';

import { Route } from '/modules/core/Action';
import { Routes } from '/modules/core/Authentication';
import { MainLayout, BlankLayout } 	from '/modules/core/LayoutManager';

import CompliancePageIndex from './imports/components/CompliancePageIndex.jsx';

Routes.loggedIn.add( {
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