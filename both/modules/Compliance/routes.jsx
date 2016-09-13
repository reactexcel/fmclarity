import React from 'react';
import { mount } from 'react-mounter';

import { Action } from '/both/modules/Action';
import { MainLayout, BlankLayout } 	from '/both/modules/LayoutManager';

import CompliancePageIndex from './imports/components/CompliancePageIndex.jsx';

const ComplianceIndexRoute = new Action( {
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
