Package.describe({  
	name: 'fmc:actions-menu',
	version: '0.0.1',
	summary: 'Actions menu react component form FM Clarity'
});

Package.onUse(function(api) {
	api.use([
		'less',
		'ecmascript'
	]);

	api.mainModule('ActionsMenu.jsx');
});