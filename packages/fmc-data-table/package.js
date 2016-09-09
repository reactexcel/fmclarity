Package.describe( {
	name: 'fmc:data-table',
	version: '0.0.1',
	summary: 'Material design compliant data table component'
} );

Package.onUse( function( api ) {

	api.use( [
		'less',
		'ecmascript',
		'pfafman:filesaver',
		'harrison:papa-parse',
		'fmc:material-navigation'
	] );

	api.addFiles( [
		'source/DataTable.less',
	], 'client' );

	api.mainModule( 'index.js' );
} );
