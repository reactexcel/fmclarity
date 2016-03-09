Package.describe({  
	name: 'fmc:orm',
	version: '0.0.1',
	summary: 'A simple implementation of Object Relational Mapping for FM Clarity'
});

Package.onUse(function(api) { 
	//api.use(['chrismbeckett:toastr','dburles:collection-helpers'],'client');
	api.addFiles('ORM.js');
	api.export('ORM');
});