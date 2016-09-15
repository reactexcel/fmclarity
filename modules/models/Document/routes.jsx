import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/modules/core/LayoutManager';
import { Routes } from '/modules/core/Authentication';

import DocsPageIndexContainer from './source/containers/DocsPageIndexContainer.jsx';

Routes.loggedIn.add( {
	name: 'docs',
	path: '/docs',
	action( params ) {
		mount( MainLayout, { content: <DocsPageIndexContainer/> } );
	}
} )
