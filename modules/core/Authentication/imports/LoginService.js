/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import { Users } from '/modules/models/Users';
import PasswordResetEmailTemplate from './components/PasswordResetEmailTemplate.jsx';


//console.log( Users );

/**
 * @class 			LoginService
 * @memberOf 		module:core/Authentication
 */
const LoginService = {
	generateLoginToken,
	generatePasswordResetToken,
	loginWithToken,
	forgotPassword,
	getUrl,
	loginUser: loginWithoutPassword,
}

Meteor.methods( {
	'LoginService.insertLoginToken': function( userId, token ) {
		Meteor.users.update( userId, {
			$push: {
				'services.LoginService.tokens': token
			}
		} );
	},
	'LoginService.generateAccountToken': function( user ) {
		if ( Meteor.isServer ) {
			var stampedLoginToken = Accounts._generateStampedLoginToken();
			Accounts._insertLoginToken( user._id, stampedLoginToken );
			return stampedLoginToken.token;
		}
	},
	'LoginService.insertPasswordResetToken': function( userId, tokenRecord ) {
		Meteor.users.update( userId, {
			$set: {
				"services.password.reset": tokenRecord
			}
		} );
	},
	'LoginService.findUserFromToken': function( token ) {
		return Meteor.users.findOne( { 'services.LoginService.tokens': { $elemMatch: { token: token } } } );
	},
	'LoginService.forgotPassword': function( email ) {
		var user = Users.findOne( { 'profile.email': email } );
		if ( !user ) {
			console.log( 'No account with that email' );
			return;
		}
		Meteor.call( 'Messages.composeEmail', {
			recipient: user,
			subject: "FM Clarity password reset",
			template: PasswordResetEmailTemplate,
			params: {
				user: user,
				token: LoginService.generatePasswordResetToken( user )
			}
		} );
	}
} )

/*
 * @function
 * @name 		forgotPassword
 * @param 		{string} email
 * @memberOf 	module:core/Authentication.LoginService
 */
function forgotPassword( email ) {
	Meteor.call( 'LoginService.forgotPassword', email );
}

/*
 * @memberOf module:core/Authentication.LoginService
 */
function generatePasswordResetToken( user ) {
	var tokenRecord = {
		token: Random.secret(),
		email: user.profile.email,
		when: new Date()
	};
	Meteor.call( 'LoginService.insertPasswordResetToken', user._id, tokenRecord );
	return tokenRecord
}


/*
 * @memberOf module:core/Authentication.LoginService
 */
function generateLoginToken( user, expiry, redirect ) {
	var now = new Date();
	var expiry = expiry || moment().add( { days: 14 } ).toDate();
	var redirect = redirect || '/';
	var tokenRecord = {
		token: Random.secret(),
		when: now,
		expiry: expiry,
		redirect: redirect
	}
	Meteor.call( "LoginService.insertLoginToken", user._id, tokenRecord );
	return tokenRecord;
}

/*
 * @memberOf module:core/Authentication.LoginService
 */
function getUrl( token, redirect ) {
	return ( token.token + '/' + encodeURIComponent( Base64.encode( redirect ) ) );
}

/*
 * @memberOf module:core/Authentication.LoginService
 */
function loginWithoutPassword( user, callback ) {
	Meteor.call( "LoginService.generateAccountToken", user, function( err, token ) {
		if ( err ) {
			console.log( err )
		} else {
			Meteor.loginWithToken( token, callback );
		}
	} );
}

/*
 * @memberOf module:core/Authentication.LoginService
 * @todo - add errors for expiry etc
 */
function loginWithToken( token, callback ) {
	//console.log(token);
	Meteor.call( "LoginService.findUserFromToken", token, function( err, user ) {
		var foundToken, expired;
		if ( user != null ) {
			foundToken = _.find( user.services.LoginService.tokens, function( item ) {
				return item.token == token
			} );
			if ( foundToken != null ) {
				//console.log(foundToken);
				expired = moment( foundToken.expiry ).isBefore();
				if ( !expired ) {
					/*console.log({
						"all good":user
					})*/
					loginWithoutPassword( user, callback );
				} else {
					callback( new Meteor.Error( '403', 'login token expired' ) );
				}
			} else {
				callback( new Meteor.Error( '403', 'invalid login token' ) );
			}
		} else {
			callback( new Meteor.Error( '403', 'user token not found' ) );
		}
	} )
}

export default LoginService;
