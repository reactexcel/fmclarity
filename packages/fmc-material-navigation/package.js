Package.describe(
{
	name: 'fmc:material-navigation',
	version: '0.0.1',
	summary: 'Material design navigation components written for react'
} );

Package.onUse( function ( api )
{
	api.use( [
		'less',
		'ecmascript',
		'fmc:doc-members'
	] );

	api.addFiles( [
		'./source/NavigationDrawer.less',
		'./source/FloatingActionButton.less',
		'./source/TopNavigationBar.jsx',
		'./source/TopNavigationBar.less',
		'./source/UserProfileMenu.less',
		'./source/NavList.less'
	] );

	api.mainModule( 'index.js' );
} );
