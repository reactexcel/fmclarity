import React from 'react';
import { mount } from 'react-mounter';

import { Route } from '/modules/core/Action';
import { MainLayout, BlankLayout } 	from '/modules/core/LayoutManager';

import CompliancePageIndex from './imports/components/CompliancePageIndex.jsx';

const ComplianceIndexRoute = new Route( {
	name: 'abc',
	path: '/abc',
	action() {
		mount( MainLayout, {
			content: <CompliancePageIndex />
		} );
	}
} );

export {
	ComplianceIndexRoute
}
