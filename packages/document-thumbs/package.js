//TODO: Remove expectation from autoform that an input element be part of the AutoInput package
//and then move the thumbnail file views into this package

// in this way we can start to create packages that include data model, actions and views
// ...real plugin components


Package.describe({  
	name: 'fmc:document-thumbs',
	version: '0.0.1',
	summary: 'Document thumbnails helper for Meteor+React'
});

Package.onUse(function(api) { 

	api.use([
		'chrismbeckett:toastr'
	],'client');

	api.use([
		'react',
		'dburles:collection-helpers'
	]);

	api.addFiles([
		'FileView.jsx',
		'DocumentThumbs.jsx'
	]);

	api.export([
		'DocThumb'
	]);
});