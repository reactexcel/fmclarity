import React from 'react';
import { mount } from 'react-mounter';

import { loggedIn } from '/both/modules/Authentication';
import { MainLayout, BlankLayout } 	from '/both/modules/LayoutManager';


var admin = FlowRouter.group( {
	triggersEnter: [
		function( context, redirect ) {
			var route;
			var user = Meteor.user();
			//console.log(user);
			if ( Meteor.loggingIn() || ( user && user.role == 'dev' ) ) {
				return;
			}
			FlowRouter.go( '/' );
			//if (!(Roles.userIsInRole(Meteor.user(),['admin']))) {
		}
	]
} );

admin.route( '/admin', {
	name: 'admin',
	action() {
		mount( MainLayout, {
			content: <AdminPage/>
		} );
	}
} );
