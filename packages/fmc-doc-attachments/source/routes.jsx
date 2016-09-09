import React from 'react';
import { mount } from 'react-mounter';

import { MainLayout, WideLayout } from 'meteor/fmc:layout';
import { loggedIn } from 'meteor/fmc:login-tokens';

import DocsPageIndex from './views/DocsPageIndex.jsx';

loggedIn.route( '/docs', {
	name: 'docs',
	action( params ) {
		mount( MainLayout, { content: <DocsPageIndex/> } );
	}
} );
