Package.describe({  
	name: 'fmc:document-thumbs',
	version: '0.0.1',
	summary: 'Document thumbnails helper for Meteor+React'
});

Package.onUse(function(api) { 
	api.use(['chrismbeckett:toastr'],'client');
	api.use(['react','dburles:collection-helpers']);
	api.addFiles('DocumentThumbs.jsx');
	api.export('DocThumb');
});