import { DocHead } from 'meteor/kadira:dochead';

import { Actions, Routes } from '/modules/core/Action';

console.log( { Actions, Routes } );

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

Actions.addAccessRule( {
	action: [ 'edit team', 'view team', 'create team request', 'create team member', 'create team facility' ],
	role: [ 'portfolio manager', 'manager' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	action: [ 'issue request', 'get request quote', 'cancel request', 'delete request' ],
	role: [ 'owner' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	action: [ 'edit team member', 'view team member' ],
	role: [ 'portfolio manager', 'manager' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	action: [ 'edit facility', 'view facility' ],
	role: [ 'team portfolio manager', 'team manager' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	action: [ 'edit request', 'view request' ],
	role: [ 'owner', 'team portfolio manager', 'team manager', 'supplier manager', 'facility manager' ],
	rule: { alert: true }
} )

Routes.addAccessRule( {
	action: [ 'dashboard', 'portfolio', 'suppliers', 'request', 'calendar', 'abc' ],
	role: [ 'portfolio manager', 'manager' ],
	rule: { alert: true }
} )

/*
Actions.addAccessRule( {
	action: 'rejectRequest',
	role: 'supplier manager',
	condition: { status: 'Issued' },
	rule: { alert: true }
} );
*/
