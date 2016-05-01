Package.describe({  
	name: 'fmc:document-messages',
	version: '0.0.1',
	summary: 'Message system for FM Clarity'
});

//TODO - mode actual pages into this package

Package.onUse(function(api) { 

	api.use([
		'underscore',
		'accounts-base',
		'less',
		'react',
		'fmc:orm',
		'fmc:rbac'
	]);

	api.addFiles([
		'DocumentMessages.js',
		'methods.js',
		'views/InboxView.jsx',
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
		'Inbox'
	]);
});