import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/modules/core/Layouts';
import { AccessGroups } from '/modules/core/Authentication';

import FilesPageIndexContainer from './source/containers/FilesPageIndexContainer.jsx';

AccessGroups.loggedIn.add( {
	name: 'all-files',
	path: '/all-files',
	action( params ) {
		mount( MainLayout, { content: <FilesPageIndexContainer/> } );
	}
} )
