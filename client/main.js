import { DocHead } from 'meteor/kadira:dochead';

import { Actions, Routes } from '/modules/core/Action';

console.log( Actions );

DocHead.setTitle( 'FM Clarity' );
DocHead.addLink( {
	rel: 'icon',
	href: '/favicon.ico?v=3',
	sizes: '16x16 32x32'
} );
DocHead.addMeta( {
	charset: 'utf-8'
} );
DocHead.addMeta( {
	name: 'viewport',
	content: 'width=device-width, initial-scale=1.0'
} );

Actions.addAccessRule( 'view team', 'fm portfolio manager', { allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit team', 'fm portfolio manager', { allowed: true, alert: true, email: false } );

Actions.addAccessRule( 'view facility', 'fm team portfolio manager', { allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit facility', 'fm team portfolio manager', { allowed: true, alert: true, email: false } );

Actions.addAccessRule( 'view request', 'fm team portfolio manager', { allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit request', 'fm team portfolio manager', { allowed: true, alert: true, email: false } );

Routes.addAccessRule( 'abc', 'fm portfolio manager', { allowed: true, alert: true, email: false } );
Routes.addAccessRule( 'all-teams', 'fm portfolio manager', { allowed: true, alert: true, email: false } );
