Package.describe({  
	name: 'fmc:doc-messages',
	version: '0.0.1',
	summary: 'Message system for FM Clarity'
});

//TODO - mode actual pages into this package

Package.onUse(function(api) { 

	api.use([
		'underscore',
		'accounts-base',
		'less',
		'ecmascript',
		'react-meteor-data',
		'fmc:orm',
		'fmc:doc-owners',
		'fmc:rbac'
	]);

	api.addFiles([
		'plugins/jquery.elastic.source.js',
	],'client');

	api.addFiles([
		'DocMessages.jsx',
		'methods.js',
		'publish.js',
		'views/InboxView.jsx',
		'views/InboxWidget.jsx',
		'views/MessagePage.jsx',
		'views/MessageView.jsx',
		'views/NotificationList.jsx',
		'views/NotificationViewSummary.jsx',
		'views/Message.less',
		'models/MessageSchema.jsx',
		'models/MessageController.jsx',
	]);

	api.export([
		'DocMessages',
		'Messages',
		'NotificationList',
		'MessagesPage',
		'UpdatesWidget',
		'Inbox'
	]);
});