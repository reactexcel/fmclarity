import React from 'react';
import { mount } from 'react-mounter';

import { loggedIn } from '/both/modules/Authentication';
import { MainLayout, BlankLayout } 	from '/both/modules/LayoutManager';

import CompliancePageIndex from './imports/components/CompliancePageIndex.jsx';

loggedIn.route( '/abc', {
	name: 'abc',
	action() {
		mount( MainLayout, {
			content: <CompliancePageIndex />
		} );
	}
} );
