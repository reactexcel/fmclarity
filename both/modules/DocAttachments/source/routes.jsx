import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from '/both/modules/LayoutManager';
import { loggedIn } from '/both/modules/Authentication';

import DocsPageIndexContainer from './containers/DocsPageIndexContainer.jsx';

loggedIn.route( '/docs', {
	name: 'docs',
	action( params ) {
		mount( MainLayout, { content: <DocsPageIndexContainer/> } );
	}
} );
