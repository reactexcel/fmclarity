import React from 'react';
import { mount } from 'react-mounter';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';
import { NotFound } from '../components/NotFound.jsx';
import { BlankLayout } from '/both/modules/LayoutManager';

const exposed = FlowRouter.group();

const  loggedIn = FlowRouter.group( {
	triggersEnter: [
		( context, redirect ) => {
			if ( !( Meteor.loggingIn() || Meteor.userId() ) ) {
				let route = FlowRouter.current();
				if ( route.route.name == 'login' ) {
					Session.set( 'redirectAfterLogin', '/' );
				} else {
					Session.set( 'redirectAfterLogin', route.path );
				}
				redirect( '/login' );
			}
		}
	]
} )

const admin = FlowRouter.group( {
	triggersEnter: [
		( context, redirect ) => {
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
} )

if ( Meteor.isClient ) {
	Accounts.onLogin( () => {
		let redirect = Session.get( 'redirectAfterLogin' );
		if ( redirect ) {
			Session.set( 'redirectAfterLogin', null )
			return FlowRouter.go( redirect );
		}
	} );

	Accounts.onLogout( () => {
		return FlowRouter.go( '/login' );
	} )
}

FlowRouter.notFound = {
	action() {
		mount( BlankLayout, {
			content: <NotFound />
		} );
	}
}

export default Routes = {
	exposed,
	loggedIn,
	admin
}
