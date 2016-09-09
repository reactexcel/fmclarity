Package.describe({  
	name: 'fmc:reports',
	version: '0.0.1',
	summary: 'Reports system used in FM Clarity'
});

//TODO - mode actual pages into this package

Package.onUse(function(api) { 

	api.use([
		'kadira:flow-router',
	],'client');

	api.use([
		'fmc:login-tokens',
		'fmc:layout',
		'fmc:calendar',
		'fmc:data-table',
		'ecmascript',
		'accounts-base',
		'base64',
		'less',
		'react-meteor-data',
		'pfafman:filesaver',
		'harrison:papa-parse'
	]);

	api.addFiles([
		'Reports.js'
	]);

	api.addFiles([

		'routes.jsx',

		'components/iBox.jsx',				//perhaps in its own package
		'components/iBox.less',
		'components/ProgressArc.jsx',		//as above

		'pages/DashboardPage.jsx',
		'pages/ReportsPageIndex.jsx',
		'pages/ReportsPageSingle.jsx',
		'pages/Reports.less',

		'plugins/jsKnob/jquery.knob.js',	//is there a nodejs module or meteor package?

		'reports/ProgressOverviewChart.jsx',
		'reports/RequestActivityChart.jsx',
		'reports/RequestActivityChart.css',
		'reports/RequestBreakdownChart.jsx',
		'reports/RequestsStatusReport.jsx',
		'reports/ReportsNavWidget.jsx'

	],'client');

	api.export([
		'DashboardPage',
		'Dataset'
	]);
});