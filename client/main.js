import { DocHead } from 'meteor/kadira:dochead';

import { Actions, Routes } from '/modules/core/Actions';

//console.log( { Actions, Routes } );

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
	action: [ 'view request' ],
	role: [ 'owner', 'team portfolio manager', 'team manager', 'supplier manager', 'facility manager' ],
	rule: { alert: true }
} )

Routes.addAccessRule( {
	action: [ 'dashboard', 'portfolio', 'suppliers', 'requests', 'calendar', 'abc' ],
	role: [ 'portfolio manager', 'manager' ],
	rule: { alert: true }
} )

Routes.addAccessRule( {
	action: [ 'admin', 'account', 'logout' ],
	role: [ 'portfolio manager', 'manager' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: { status: 'Draft' },
	action: [
		'create request',
		'delete request',
	],
	role: [ 'owner' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: { status: 'New' },
	action: [
		'edit request',
		'issue request',
		'reject request',
		'get request quote',
	],
	role: [ 'owner' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: { status: 'Issued' },
	action: [
		'delete request',
	],
	role: [ 'owner' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: { status: 'Issued' },
	action: [
		'accept request',
		'reject request',
	],
	role: [ 'supplier manager', 'assignee' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: { status: 'In Progress' },
	action: [
		'complete request',
	],
	role: [ 'supplier manager', 'assignee' ],
	rule: { alert: true }
} )

Actions.addAccessRule( {
	condition: { status: 'Complete' },
	action: [
		'delete request',
		'cancel request',
		'issue request',
		'accept request',
		'reject request',
		'get request quote',
		'send request quote',
		'complete request',
		'close request',
		'reopen request',
		'reverse request'
	],
	role: [ 'supplier manager', 'assignee' ],
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
