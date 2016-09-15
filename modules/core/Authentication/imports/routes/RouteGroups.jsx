import React from 'react';
import { mount } from 'react-mounter';

import { Accounts } from 'meteor/accounts-base';
import { BlankLayout } from '/modules/core/LayoutManager';

import { Action, RouteGroup } from '/modules/core/Action';

import NotFound from '../components/NotFound.jsx';

const exposed = new RouteGroup( {
	name: 'exposed'
} );

const loggedIn = new RouteGroup( {
	name: 'loggedIn',
	onEnter: ( context, redirect ) => {
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
} );

const admin = new RouteGroup( {
	name: 'admin',
	onEnter: ( context, redirect ) => {
		let user = Meteor.user();
		if ( Meteor.loggingIn() || ( user && user.role == 'dev' ) ) {
			return;
		}
		FlowRouter.go( '/' );
	}
} );

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
