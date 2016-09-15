import { DocHead } from 'meteor/kadira:dochead';

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

Actions.addAccessRule( 'view team', 'portfolio manager', { allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'view facility', 'team portfolio manager', { allowed: true, alert: true, email: false } );
Actions.addAccessRule( 'abc', 'portfolio manager', { allowed: true, alert: true, email: false } );
