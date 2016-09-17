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

Actions.addAccessRule( 'view team', 'portfolio manager', 			{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit team', 'portfolio manager', 			{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'view team', 'manager', 						{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit team', 'manager', 						{ allowed: true, alert: true, email: false } );

Actions.addAccessRule( 'view member', 'portfolio manager', 			{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit member', 'portfolio manager', 			{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'view member', 'manager', 					{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit member', 'manager', 					{ allowed: true, alert: true, email: false } );

Actions.addAccessRule( 'view facility', 'team portfolio manager', 	{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit facility', 'team portfolio manager', 	{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'view facility', 'team manager', 			{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit facility', 'team manager', 			{ allowed: true, alert: true, email: false } );

Actions.addAccessRule( 'view request', 'team portfolio manager', 	{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit request', 'team portfolio manager', 	{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'view request', 'team manager', 				{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit request', 'team manager', 				{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'view request', 'supplier manager', 			{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit request', 'supplier manager', 			{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'view request', 'facility manager', 			{ allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'edit request', 'facility manager', 			{ allowed: true, alert: true, email: false } );

Routes.addAccessRule( 'abc', 'portfolio manager', 					{ allowed: true, alert: true, email: false } );
Routes.addAccessRule( 'all-teams', 'portfolio manager', 			{ allowed: true, alert: true, email: false } );
Routes.addAccessRule( 'all-users', 'portfolio manager', 			{ allowed: true, alert: true, email: false } );