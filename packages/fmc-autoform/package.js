Package.describe({  
	name: 'fmc:autoform',
	version: '0.0.1',
	summary: 'Autoform component for FM Clarity. Works with fmc:orm and fmc:rbac to automatically create forms from schemas'
});

Package.onUse(function(api) {
	api.use([
		'less',
		'ecmascript',
	]);

	api.addFiles([
		'source/AutoForm.less',
	],'client');

	api.mainModule( 'index.js' );
});