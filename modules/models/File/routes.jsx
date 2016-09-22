import React from 'react';
import { mount } from 'react-mounter';

import { LayoutMain, LayoutWide } from '/modules/core/Layouts';
import { AccessGroups } from '/modules/core/Authentication';

import FilesPageIndexContainer from './source/containers/FilesPageIndexContainer.jsx';

AccessGroups.loggedIn.add( {
	name: 'all-files',
	path: '/all-files',
	action( params ) {
		mount( LayoutMain, { content: <FilesPageIndexContainer/> } );
	}
} )
