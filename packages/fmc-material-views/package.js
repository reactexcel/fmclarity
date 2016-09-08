Package.describe( {
	name: 'fmc:material-views',
	version: '0.0.1',
	summary: 'A library of Material Design compliant view components for use in FM Clarity'
} );

Package.onUse( function( api ) {
	api.use( [
		'underscore',
		'ecmascript'
	] );

	api.mainModule( 'index.js' );

} );
