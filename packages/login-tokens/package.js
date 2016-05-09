Package.describe({  
	name: 'fmc:login-tokens',
	version: '0.0.1',
	summary: 'Login token system used in FM Clarity'
});

//TODO - mode actual pages into this package

Package.onUse(function(api) { 

	api.use([
		'kadira:flow-router',
	],'client');

	api.use([
		'ecmascript',
		'accounts-base',
		'base64'
	]);

	api.addFiles([
		'LoginTokens.js'
	]);

	api.addFiles([
		'Routes.jsx',
		'pages/403.jsx',
		'pages/Login.jsx',
		'pages/LostPassword.jsx',
		'pages/ChangePassword.jsx',
		'pages/Register.jsx'
	],'client');

	api.export([
		'FMCLogin',
		'PageChangePassword'
	]);
});