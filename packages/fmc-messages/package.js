Package.describe({  
	name: 'fmc:document-messages',
	version: '0.0.1',
	summary: 'Message system for FM Clarity'
});

//TODO - mode actual pages into this package

Package.onUse(function(api) { 

	api.use([
	]);

	api.addFiles([
		'DocumentMessages.js'
	]);

	api.export([
		'DocMessages'
	]);
});