//TODO: Remove expectation from autoform that an input element be part of the AutoInput package
//and then move the thumbnail file views into this package

// in this way we can start to create packages that include data model, actions and views
// ...real plugin components


Package.describe({  
	name: 'fmc:doc-attachments',
	version: '0.0.1',
	summary: 'Document attachments helper for Meteor+React'
});

Package.onUse(function(api) { 

	api.use([
		'react',
		'less',
	]);

	api.addFiles([
		'FileView.jsx',
		'FileExplorerView.jsx',
		'style.less',
		'DocumentAttachments.jsx'
	]);

	api.export([
		'DocAttachments'
	]);
});