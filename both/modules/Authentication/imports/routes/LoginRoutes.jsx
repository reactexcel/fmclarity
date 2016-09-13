import React from "react";
import { mount } from 'react-mounter';

import Routes from './RouteGroups.jsx';
import { BlankLayout } from '/both/modules/LayoutManager';

Routes.exposed.route( '/login', {
	name: 'login',
	action() {
		var redirect = Session.get( 'redirectAfterLogin' );
		if ( !redirect ) {
			Session.set( 'redirectAfterLogin', '/' );
		}
		mount( BlankLayout, { content: <PageLogin/> } );
	},
} )

Routes.exposed.route( '/enroll-account/:token', {
	name: 'enroll',
	action( params, queryParams ) {
		var token = params.token;
		Accounts.resetPassword( token, 'fm1q2w3e' );
		FlowRouter.go( '/change-password' );
	}
} )

Routes.exposed.route( '/register', {
	name: 'register',
	action() {
		mount( BlankLayout, { content: <PageRegister/> } );
	}
} )

Routes.exposed.route( '/lost-password', {
	name: 'lost-password',
	action() {
		mount( BlankLayout, { content: <PageLostPassword/> } );
	}
} )

Routes.exposed.route( '/reset-password/:token', {
	name: 'reset-password',
	action( params, queryParams ) {
		var token = params.token;
		Session.set( 'redirectAfterLogin', '/change-password' );
		Accounts.resetPassword( token, 'fm1q2w3e' );
	}
} )

Routes.exposed.route( '/u/:token/:redirect', {
	name: 'loginWithToken',
	action( params ) {
		var redirect = Base64.decode( decodeURIComponent( params.redirect ) );
		redirect = String.fromCharCode.apply( null, redirect );
		FMCLogin.loginWithToken( params.token, function( err ) {
			if ( err ) {
				console.log( err );
				FlowRouter.go( '/403' );
			} else {
				FlowRouter.go( '/' + redirect );
			}
		} );
	}
} )

Routes.loggedIn.route( '/logout', {
	name: 'logout',
	action() {
		Meteor.logout( function() {
			return FlowRouter.go( '/' );
		} );
	}
} )

Routes.loggedIn.route( '/change-password', {
	name: 'change-password',
	action() {
		mount( BlankLayout, {
			content: <PageChangePassword />
		} );
	}
} )

