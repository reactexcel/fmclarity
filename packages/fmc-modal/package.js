Package.describe({  
	name: 'fmc:modal',
	version: '0.0.1',
	summary: 'MD Compliant stepper component for FM Clarity'
});

Package.onUse(function(api) {
	api.use([
		'less',
		'ecmascript',
		'react-meteor-data',
	]);

	api.addFiles([
		'Modal.jsx',
		'Modal.less'
	]);

	api.export([
		'Modal'
	]);
});