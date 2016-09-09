Package.describe({  
	name: 'fmc:material-inputs',
	version: '0.0.1',
	summary: 'Material design style input components for FM Clarity'
});

Package.onUse(function(api) {
	api.use([
		'less',
		'ecmascript',
		'react-meteor-data'
	]);

	api.addFiles([
		'source/plugins/jquery.elastic.source.js',
		'source/Text.less',
		'source/TextArea.less',
		'source/Select.less',
		'source/Date.less',
		'source/Switch.less'
	],'client');

	api.mainModule( 'index.js' );
});