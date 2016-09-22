import React from 'react';
import { mount } from 'react-mounter';

import { LayoutMain, LayoutWide } from '/modules/core/Layouts';
import { AccessGroups } from '/modules/core/Authentication';

import FilesPageIndexContainer from './imports/containers/FilesPageIndexContainer.jsx';

AccessGroups.loggedIn.add( {
	name: 'all-files',
	path: '/all-files',
	label: "All files",
	icon: 'fa fa-files-o',
	action( params ) {
		mount( LayoutMain, { content: <FilesPageIndexContainer/> } );
	}
} )
