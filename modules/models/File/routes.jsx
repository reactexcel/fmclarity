import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/modules/core/LayoutManager';
import { Routes } from '/modules/core/Authentication';

import FilesPageIndexContainer from './source/containers/FilesPageIndexContainer.jsx';

Routes.loggedIn.add( {
	name: 'files',
	path: '/files',
	action( params ) {
		mount( MainLayout, { content: <FilesPageIndexContainer/> } );
	}
} )
