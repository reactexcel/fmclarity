Package.describe(
{
	name: 'fmc:layout',
	version: '0.0.1',
	summary: 'Simple layout manager for Meteor React'
} );

Package.onUse( function ( api )
{
	api.use( [
		'less',
		'ecmascript',
		'fmc:material-navigation'
	] );

	api.mainModule( 'index.js' );
} );
