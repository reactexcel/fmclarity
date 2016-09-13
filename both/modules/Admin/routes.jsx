import React from 'react';
import { mount } from 'react-mounter';

import { Routes } from '/both/modules/Authentication';
import { MainLayout, BlankLayout } 	from '/both/modules/LayoutManager';

Routes.admin.add( {
	name: 'admin',
	path: '/admin',
	action() {
		mount( MainLayout, {
			content: <AdminPage/>
		} );
	}
} );
