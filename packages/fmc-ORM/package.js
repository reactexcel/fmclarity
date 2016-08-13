Package.describe({  
	name: 'fmc:orm',
	version: '0.0.1',
	summary: 'A simple implementation of Object Relational Mapping for FM Clarity'
});

Package.onUse(function(api) { 

	//api.use(['chrismbeckett:toastr','dburles:collection-helpers'],'client');

	api.use([
		'underscore',
		'fmc:doc-owners',
		'matb33:collection-hooks',
		'ecmascript',
		'fmc:rbac' //should not be a dependence, refactor by removing line 23 or ORM.js
	]);
	api.addFiles([
		'ORM.jsx'
	]);

	api.export([
		'ORM'
	]);
});