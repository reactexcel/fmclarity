Package.describe( {
	name: 'fmc:doc-messages',
	version: '0.0.1',
	summary: 'Message system for FM Clarity'
} );

//TODO - mode actual pages into this package

Package.onUse( function( api ) {

	api.use( [
		'underscore',
		'accounts-base',
		'less',
		'ecmascript',
		'react-meteor-data',
		'fmc:orm',
		'fmc:doc-owners',
		'fmc:rbac'
	] );

	api.addFiles( [
		'source/plugins/jquery.elastic.source.js',
	], 'client' );

	api.addFiles( [
		'source/components/Message.less',
	] );

	api.mainModule( 'index.js' );

} );
