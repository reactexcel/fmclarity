/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import { mount } from 'react-mounter';
import { Accounts } from 'meteor/accounts-base';

import { LayoutBlank } from '/modules/core/Layouts';
import { Action, RouteGroup } from '/modules/core/Actions';

import PageNotFound from './components/PageNotFound.jsx';

/**
 * @memberOf 		module:core/Authentication
 */
const AccessGroups = {

	/** 
	 * A group of routes that are visible to the public
	 * named 'exposed' because 'public' is a reserved word
	 * @type function
	 */
	exposed: new RouteGroup( {
		name: 'exposed'
	} ),

	/** 
	 * Routes available only to logged in, registered members
	 * @type function
	 */
	loggedIn: new RouteGroup( {
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
	} ),

	/** 
	 * Routes for app administrators or developers
	 * @type function
	 */
	admin: new RouteGroup( {
		name: 'admin',
		onEnter: ( context, redirect ) => {}
	} )

}

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
		mount( LayoutBlank, {
			content: <PageNotFound />
		} );
	}
}

export default AccessGroups;
