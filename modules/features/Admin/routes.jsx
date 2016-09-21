import React from 'react';
import { mount } from 'react-mounter';

import { AccessGroups } from '/modules/core/Authentication';
import { MainLayout, BlankLayout } 	from '/modules/core/Layouts';
import AdminPageIndex from './imports/AdminPageIndex.jsx';

AccessGroups.admin.add( {
	name: 'admin',
	path: '/admin',
	action() {
		mount( MainLayout, {
			content: <AdminPageIndex/>
		} );
	}
} );
