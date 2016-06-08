Package.describe({  
	name: 'fmc:autoform',
	version: '0.0.1',
	summary: 'Autoform component for FM Clarity. Works with fmc:orm and fmc:rbac to automatically create forms from schemas'
});

Package.onUse(function(api) {
	api.use([
		'fmc:orm',
		'fmc:rbac',
		'less',
		'ecmascript',
		'react-meteor-data',
	]);

	api.addFiles([
	]);

	api.export([
	]);
});