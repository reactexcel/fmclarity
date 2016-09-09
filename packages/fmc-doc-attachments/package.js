//TODO: Remove expectation from autoform that an input element be part of the AutoInput package
//and then move the thumbnail file views into this package

// in this way we can start to create packages that include data model, actions and views
// ...real plugin components


Package.describe( {
	name: 'fmc:doc-attachments',
	version: '0.0.1',
	summary: 'Document attachments helper for Meteor+React'
} );

Package.onUse( function( api ) {

	api.use( [
		'kadira:flow-router',
		'ecmascript',
		'less',
		'react-meteor-data',
		'fmc:orm',
		'fmc:rbac',
		'fmc:doc-owners',
		'fmc:login-tokens'
	] );

	api.addFiles( [
		'source/routes.jsx',
		'source/style.less',
	] );

	api.mainModule( 'index.js' );

} );
