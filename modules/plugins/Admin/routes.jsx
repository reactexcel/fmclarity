import React from 'react';
import { mount } from 'react-mounter';

import { Routes } from '/modules/core/Authentication';
import { MainLayout, BlankLayout } 	from '/modules/core/LayoutManager';
import AdminPageIndex from './imports/AdminPageIndex.jsx';

Routes.admin.add( {
	name: 'admin',
	path: '/admin',
	action() {
		mount( MainLayout, {
			content: <AdminPageIndex/>
		} );
	}
} );
