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
		'jquery',
		'react-meteor-data',
	]);

	api.addFiles([
		'plugins/jquery.elastic.source.js',
		'lib/AutoForm.jsx',
		'lib/AutoForm.less',
		'inputs/Date.jsx',
		'inputs/File.jsx',
		'inputs/MDDate.jsx',
		'inputs/MDDate.less',
		'inputs/MDSelect.jsx',
		'inputs/MDSelect.less',
		'inputs/MDText.jsx',
		'inputs/MDText.less',
		'inputs/MDTextArea.jsx',
		'inputs/MDTextArea.less',
		'inputs/Rating.jsx',
		'inputs/Switch.jsx',
		'inputs/Switch.less',
		'inputs/Text.jsx',
		'inputs/TextArea.jsx'
	],'client');

	api.export([
		'AutoForm',
		'AutoInput'
	]);
});