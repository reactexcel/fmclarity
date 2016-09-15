import React from "react";
import { mount } from 'react-mounter';

import Routes from './RouteGroups.jsx';
import { BlankLayout } from '/modules/core/LayoutManager';

Routes.exposed.add( {
	name: 'login',
	path: '/login',
	action() {
		var redirect = Session.get( 'redirectAfterLogin' );
		if ( !redirect ) {
			Session.set( 'redirectAfterLogin', '/' );
		}
		mount( BlankLayout, { content: <PageLogin/> } );
	},
} );

Routes.exposed.add( {
	name: 'enroll',
	path: '/enroll-account/:token',
	action( params, queryParams ) {
		var token = params.token;
		Accounts.resetPassword( token, 'fm1q2w3e' );
		FlowRouter.go( '/change-password' );
	}
} );

Routes.exposed.add( {
	name: 'register',
	path: '/register',
	action() {
		mount( BlankLayout, { content: <PageRegister/> } );
	}
} );

Routes.exposed.add( {
	name: 'lost-password',
	path: '/lost-password',
	action() {
		mount( BlankLayout, { content: <PageLostPassword/> } );
	}
} );

Routes.exposed.add( {
	name: 'reset-password',
	path: '/reset-password/:token',
	action( params, queryParams ) {
		var token = params.token;
		Session.set( 'redirectAfterLogin', '/change-password' );
		Accounts.resetPassword( token, 'fm1q2w3e' );
	}
} );

Routes.exposed.add( {
	name: 'loginWithToken',
	path: '/u/:token/:redirect',
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
} );

Routes.loggedIn.add( {
	name: 'logout',
	path: '/logout',
	action() {
		Meteor.logout( function() {
			return FlowRouter.go( '/' );
		} );
	}
} );

Routes.loggedIn.add( {
	name: 'change-password',
	path: '/change-password',
	action() {
		mount( BlankLayout, {
			content: <PageChangePassword />
		} );
	}
} );
