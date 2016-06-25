Package.describe({  
	name: 'fmc:tabs',
	version: '0.0.1',
	summary: 'MD Compliant tabs component for FM Clarity'
});

Package.onUse(function(api) { 
	api.use([
		'less',
		'ecmascript',
		'react-meteor-data',
	]);

	api.addFiles([
		'Tabs.jsx',
		'Tabs.less'
	]);

	api.export([
		'IpsoTabso'
	]);
});