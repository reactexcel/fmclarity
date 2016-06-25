// I feel like contact, and perhaps contacts, should be a part of this package

Package.describe({  
	name: 'fmc:doc-members',
	version: '0.0.1',
	summary: 'A simple implementation of Role Based Access Control for FM Clarity'
});

Package.onUse(function(api) { 
	api.use([
		'fmc:rbac',
		'ecmascript',
		'react-meteor-data',
	]);

	api.addFiles([
		'DocMembers.js',
		'views/Contact.css',
		'views/ContactList.jsx',
		'views/ContactCard.jsx'
	]);

	api.export([
		'DocMembers',
		'ContactAvatarSmall',
		'ContactCard',
		'ContactList'
	]);
});