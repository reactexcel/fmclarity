import React from 'react';
import { mount } from 'react-mounter';

import { Routes } from '/modules/core/Authentication';
import { MainLayout, BlankLayout } 	from '/modules/core/LayoutManager';

Routes.admin.add( {
	name: 'admin',
	path: '/admin',
	action() {
		mount( MainLayout, {
			content: <AdminPage/>
		} );
	}
} );
