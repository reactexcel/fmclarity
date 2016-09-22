import React from 'react';
import { mount } from 'react-mounter';

import { LayoutMain, LayoutWide } from '/modules/core/Layouts';
import { AccessGroups } from '/modules/core/Authentication';

import DocsPageIndexContainer from './imports/containers/DocsPageIndexContainer.jsx';

AccessGroups.loggedIn.add( {
	name: 'docs',
	path: '/docs',
	action( params ) {
		mount( LayoutMain, { content: <DocsPageIndexContainer/> } );
	}
} )
