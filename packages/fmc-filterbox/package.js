Package.describe({  
	name: 'fmc:filterbox',
	version: '0.0.1',
	summary: 'Page layout with navigation filter and main window.'
});

Package.onUse(function(api) {
	api.use([
		'less',
		'ecmascript',
		'react-meteor-data',
	]);

	api.addFiles([
		'FilterBox.jsx',
		'FilterBox.css',
		'FilterBox2.jsx',
		'FilterBox2.css',
	]);

	api.export([
		'FilterBox',
		'FilterBox2',
	]);
});