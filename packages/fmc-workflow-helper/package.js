Package.describe(
{
	name: 'fmc:workflow-helper',
	version: '0.0.1',
	summary: 'A helper for creating a state-transition implementation of workflows'
} );

Package.onUse( function( api )
{
	api.use( [ 'ecmascript', 'underscore' ] );
	api.addFiles( [] );
	api.export( [] );
	api.mainModule( 'index.js' );
} );

Package.onTest( function( api )
{
	api.use( [ 'fmc:workflow-helper', 'practicalmeteor:mocha' ] );
} );
