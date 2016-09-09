Package.describe({  
	name: 'fmc:calendar',
	version: '0.0.1',
	summary: 'calendar component for FM Clarity'
});

Package.onUse(function(api) {
	api.use([
		'less',
		'ecmascript',
		'react-meteor-data',
		'rzymek:fullcalendar',
	]);

	api.addFiles([
		'Calendar.less'
	]);

	api.mainModule('Calendar.jsx');
});