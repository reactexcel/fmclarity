Package.describe({  
	name: 'fmc:rbac',
	version: '0.0.1',
	summary: 'A simple implementation of Role Based Access Control for FM Clarity'
});

Package.onUse(function(api) { 
	api.use([
		'chrismbeckett:toastr'
	],'client');

	api.use([
		'underscore',
		'dburles:collection-helpers'
	]);

	api.addFiles([
		'RBAC.js',
		'AccessHelpers.js',
		'AuthenticationHelpers.js'
	]);

	api.export([
		'RBAC',
		'AuthHelpers',
		'AccessHelpers'
	]);
});