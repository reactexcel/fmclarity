import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/both/modules/LayoutManager';
import { Routes } from '/both/modules/Authentication';

import FilesPageIndexContainer from './containers/FilesPageIndexContainer.jsx';

Routes.loggedIn.route( '/files', {
	name: 'files',
	action( params ) {
		mount( MainLayout, { content: <FilesPageIndexContainer/> } );
	}
} )
