Package.describe({  
	name: 'fmc:material-inputs',
	version: '0.0.1',
	summary: 'Material design style input components for FM Clarity'
});

Package.onUse(function(api) {
	api.use([
		'less',
		'ecmascript'
	]);

	api.addFiles([
		'source/plugins/jquery.elastic.source.js',
		'source/Text.less',
		'source/TextArea.less',
		'source/Select.less',
		'source/Date.less',
		'source/Switch.less',
		'source/DataTableSelect.less'
	],'client');

	api.mainModule( 'index.js' );
});