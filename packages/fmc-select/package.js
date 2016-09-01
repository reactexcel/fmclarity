Package.describe(
{
	name: 'fmc:select',
	version: '0.0.1',
	summary: 'A simple implementation of Role Based Access Control for FM Clarity'
} );

Package.onUse( function( api )
{
	api.use( [
		'less',
		'ecmascript',
		'react-meteor-data',
	] );

	api.addFiles( [
		'Select.jsx',
		'Select.less'
	] );

	api.export( [
		'SuperSelect',
		'NameCard'
	] );
} );
