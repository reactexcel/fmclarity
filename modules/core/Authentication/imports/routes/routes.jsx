import React from "react";
import { mount } from 'react-mounter';

import AccessGroups from './AccessGroups.jsx';
import { LayoutBlank } from '/modules/core/Layouts';

AccessGroups.exposed.add( {
	name: 'login',
	path: '/login',
	action() {
		var redirect = Session.get( 'redirectAfterLogin' );
		if ( !redirect ) {
			Session.set( 'redirectAfterLogin', '/' );
		}
		mount( LayoutBlank, { content: <PageLogin/> } );
	},
} );

AccessGroups.exposed.add( {
	name: 'enroll',
	path: '/enroll-account/:token',
	action( params, queryParams ) {
		var token = params.token;
		Accounts.resetPassword( token, 'fm1q2w3e' );
		FlowRouter.go( '/change-password' );
	}
} );

AccessGroups.exposed.add( {
	name: 'register',
	path: '/register',
	action() {
		mount( LayoutBlank, { content: <PageRegister/> } );
	}
} );

AccessGroups.exposed.add( {
	name: 'lost-password',
	path: '/lost-password',
	action() {
		mount( LayoutBlank, { content: <PageLostPassword/> } );
	}
} );

AccessGroups.exposed.add( {
	name: 'reset-password',
	path: '/reset-password/:token',
	action( params, queryParams ) {
		var token = params.token;
		Session.set( 'redirectAfterLogin', '/change-password' );
		Accounts.resetPassword( token, 'fm1q2w3e' );
	}
} );

AccessGroups.exposed.add( {
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

AccessGroups.loggedIn.add( {
	name: 'logout',
	path: '/logout',
	action() {
		Meteor.logout( function() {
			return FlowRouter.go( '/' );
		} );
	}
} );

AccessGroups.loggedIn.add( {
	name: 'change-password',
	path: '/change-password',
	action() {
		mount( LayoutBlank, {
			content: <PageChangePassword />
		} );
	}
} );
