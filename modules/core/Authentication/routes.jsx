import React from "react";
import { mount } from 'react-mounter';

import { LayoutBlank } from '/modules/core/Layouts';

import AccessGroups from './imports/AccessGroups.jsx';
import PageLogin from './imports/components/PageLogin.jsx';
import PageRegister from './imports/components/PageRegister.jsx';
import PageLostPassword from './imports/components/PageLostPassword.jsx';
import PageChangePassword from './imports/components/PageChangePassword.jsx';
import LoginService from './imports/LoginService.js';
import Page403 from './imports/components/Page403.jsx';
import PageRequestLinkExpired from './imports/components/PageRequestLinkExpired.jsx';
import PageInviteFailed from './imports/components/PageInviteFailed.jsx';

AccessGroups.exposed.add( {
	name: 'login',
	path: '/login',
	action() {
		var redirect = Session.get( 'redirectAfterLogin' );
		if ( !redirect ) {
			redirect = '/';
			Session.set( 'redirectAfterLogin', '/' );
		}
		if(Meteor.userId()){
			FlowRouter.go( redirect );
		}
		mount( LayoutBlank, { content: <PageLogin/> } );
	},
} );

AccessGroups.exposed.add( {
	name: 'enroll',
	path: '/enroll-account/:token',
	action( params, queryParams ) {
		var token = params.token;
		Accounts.resetPassword( token, 'fm1q2w3e', ( err ) => {
			if( err ) {
				console.log( err );
				mount( LayoutBlank, { content: <PageInviteFailed/> } );
			}
			else {
				FlowRouter.go( '/change-password' );
			}
		} );
	}
} );

/*
AccessGroups.exposed.add( {
	name: 'register',
	path: '/register',
	action() {
		mount( LayoutBlank, { content: <PageRegister/> } );
	}
} );
*/

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
		Accounts.resetPassword( token, 'fm1q2w3e', ( err ) => {
			if( err ) {
				console.log( err );
				mount( LayoutBlank, { content: <PageInviteFailed /> } );
			}
			else {
				FlowRouter.go( '/change-password' );
			}
		} );
	}
} );

AccessGroups.exposed.add( {
	name: 'loginWithToken',
	path: '/u/:token/:redirect',
	action( params ) {
		var redirect = Base64.decode( decodeURIComponent( params.redirect ) );
		redirect = String.fromCharCode.apply( null, redirect );
		//console.log( redirect );
		LoginService.loginWithToken( params.token, function( err ) {
			//console.log( 'Did it!' );
			if ( err ) {
				console.log( err );
				if (redirect.substring(0, 9) == "requests/") {
					mount( LayoutBlank, { content: <PageRequestLinkExpired /> } );
				}
				else{
					mount( LayoutBlank, { content: <Page403 /> } );
				}

			} else {
				FlowRouter.go( '/' + redirect );
			}
		} );
	}
} );
Meteor.logout = function (callback) {
			if(Meteor.userId()){
				Accounts.makeClientLoggedOut();
			}
			callback && callback();
  }
AccessGroups.loggedIn.add( {
	name: 'logout',
	path: '/logout',
	label: 'Logout',
	icon: 'fa fa-sign-out',
	action() {
		Meteor.logout( function(err) {
			location.reload();
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

AccessGroups.exposed.add( {
	name: 'access-denied',
	path: '/403',
	action() {
		mount( LayoutBlank, { content: <Page403 /> } );
	}
} );

AccessGroups.exposed.add( {
	name: 'request-link-expired',
	path: '/request-link-expired',
	action() {
		mount( LayoutBlank, { content: <PageRequestLinkExpired /> } );
	}
} );
