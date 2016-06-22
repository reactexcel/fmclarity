Package.describe({  
	name: 'fmc:doc-owners',
	version: '0.0.1',
	summary: 'Extends collections so that they can include "owners"'
});

Package.onUse(function(api) { 

	//api.use(['chrismbeckett:toastr','dburles:collection-helpers'],'client');

	api.use([
		'underscore',
		'matb33:collection-hooks',
		'ecmascript',
		'react-meteor-data',
		'mongo',
	]);
	api.addFiles([
		'DocOwners.js',
		'DocOwnerCard.jsx'
	]);

	api.export([
		'DocOwners',
		'DocOwnerCard'
	]);
});