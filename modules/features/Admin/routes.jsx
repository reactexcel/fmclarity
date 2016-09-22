import React from 'react';
import { mount } from 'react-mounter';

import { AccessGroups } from '/modules/core/Authentication';
import { LayoutMain, LayoutBlank } 	from '/modules/core/Layouts';
import AdminPageIndex from './imports/AdminPageIndex.jsx';

AccessGroups.admin.add( {
	name: 'admin',
	path: '/admin',
	label: 'Admin',
	icon: 'fa fa-balance-scale',
	action() {
		mount( LayoutMain, {
			content: <AdminPageIndex/>
		} );
	}
} );
