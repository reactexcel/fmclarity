import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/both/modules/LayoutManager';
import { Routes } from '/both/modules/Authentication';

import DocsPageIndexContainer from './containers/DocsPageIndexContainer.jsx';

Routes.loggedIn.add( {
	name: 'docs',
	path: '/docs',
	action( params ) {
		mount( MainLayout, { content: <DocsPageIndexContainer/> } );
	}
} )
