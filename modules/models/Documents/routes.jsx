import React from 'react';
import { mount } from 'react-mounter';

import { LayoutMain, LayoutWide } from '/modules/core/Layouts';
import { AccessGroups } from '/modules/core/Authentication';

import DocsPageIndexContainer from './imports/containers/DocsPageIndexContainer.jsx';
import DocsSinglePageIndexContainer from './imports/containers/DocsSinglePageIndexContainer.jsx';

AccessGroups.loggedIn.add( {
	name: 'docs',
	path: '/docs',
	action( params ) {
		mount( LayoutMain, { content: <DocsPageIndexContainer/> } );
	}
} )

AccessGroups.loggedIn.add( {
	name: 'user-docs',
	path: '/userdocs',
	label:" Documents",
	icon: 'fa fa-file-o',
	action( params ) {
		mount( LayoutMain, { content: <DocsSinglePageIndexContainer/> } );
	}
} )
