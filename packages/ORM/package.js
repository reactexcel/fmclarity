Package.describe({  
	name: 'fmc:orm',
	version: '0.0.1',
	summary: 'A simple implementation of Object Relational Mapping for FM Clarity'
});

Package.onUse(function(api) { 

	//api.use(['chrismbeckett:toastr','dburles:collection-helpers'],'client');

	api.use([
		'underscore',
		'matb33:collection-hooks',
		'mongo',
		'fmc:rbac' //should not be a dependence, refactor by removing line 23 or ORM.js
	]);
	api.addFiles([
		'ORM.js'
	]);

	api.export([
		'ORM'
	]);
});