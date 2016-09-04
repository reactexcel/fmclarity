Package.describe({  
	name: 'fmc:doc-owners',
	version: '0.0.1',
	summary: 'Extends collections so that they can include "owners"'
});

Package.onUse(function(api) { 

	api.use([
		'underscore',
		'ecmascript',
		'react-meteor-data',
		'mongo',
		'fmc:doc-members'
	]);

	api.mainModule( 'index.js' );
});