Package.describe({  
	name: 'fmc:login-tokens',
	version: '0.0.1',
	summary: 'Login token system used in FM Clarity'
});

Package.onUse(function(api) { 
	//api.use(['chrismbeckett:toastr'],'client');
	api.use(['accounts-base','base64']);
	api.addFiles('LoginTokens.js');
	api.export('FMCLogin');
});