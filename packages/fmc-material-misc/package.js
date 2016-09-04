Package.describe(
{
	name: 'fmc:material-misc',
	version: '0.0.1',
	summary: 'Misc material design components written for react'
} );

Package.onUse( function ( api )
{
	api.use( [
		'less',
		'ecmascript'
	] );

	api.addFiles( [
		'./source/Chip.less',
	] );

	api.mainModule( 'index.js' );
} );
