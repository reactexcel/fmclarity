// can we include all login functionality in this package?
// including the login forms and the rest?

FMCLogin = {
	generateLoginToken,
	generatePasswordResetToken,
	loginWithToken,
	forgotPassword,
	getUrl,
	loginUser:loginWithoutPassword,
}

Meteor.methods({
	'FMCLogin.insertLoginToken':function(userId,token){
		Meteor.users.update(userId,{$push:{
			'services.FMCLogin.tokens':token
		}});
	},
	'FMCLogin.generateAccountToken':function(user) {
		if(Meteor.isServer) {
			var stampedLoginToken = Accounts._generateStampedLoginToken();
			Accounts._insertLoginToken(user._id, stampedLoginToken);
			return stampedLoginToken.token;
		}
	},
	'FMCLogin.insertPasswordResetToken':function(userId,tokenRecord) {
  		Meteor.users.update(userId, {$set: {
    		"services.password.reset": tokenRecord
  		}});		
	},
	'FMCLogin.findUserFromToken':function(token){
		return Meteor.users.findOne({'services.FMCLogin.tokens':{$elemMatch:{token:token}}});
	},
	'FMCLogin.forgotPassword':function(email) {
		var user = Users.findOne({'profile.email':email});
		if(!user) {
			console.log('No account with that email');
			return;
		}
		Meteor.call('Messages.composeEmail',{
		    recipient:user,
		    subject:"FM Clarity password reset",
		    template:PasswordResetEmailTemplate,
		    params:{
		      user:user,
		      token:FMCLogin.generatePasswordResetToken(user)
		    }
		});	
	}
})

function forgotPassword(email) {
	Meteor.call('FMCLogin.forgotPassword',email);
}

function generatePasswordResetToken(user) {
  	var tokenRecord = {
    	token: Random.secret(),
    	email: user.profile.email,
    	when: new Date()
  	};
  	Meteor.call('FMCLogin.insertPasswordResetToken',user._id,tokenRecord);
  	return tokenRecord
}

function generateLoginToken(user,expiry,redirect) {
	var now = new Date();
	var expiry = expiry||moment().add({days:14}).toDate();
	var redirect = redirect||'/';
	var tokenRecord = {
		token:Random.secret(),
		when:now,
		expiry:expiry,
		redirect:redirect
	}
	Meteor.call("FMCLogin.insertLoginToken",user._id,tokenRecord);
	return tokenRecord;
}

function getUrl(token,redirect) {
	return (token.token+'/'+encodeURIComponent(Base64.encode(redirect)));
}

function loginWithoutPassword(user,callback) {
	Meteor.call("FMCLogin.generateAccountToken",user,function(err,token){
		if(err) {
			console.log(err)
		}
		else {
			Meteor.loginWithToken(token,callback);
		}
	});
}

// add errors for expiry etc
function loginWithToken(token,callback) {
	//console.log(token);
	Meteor.call("FMCLogin.findUserFromToken",token,function(err,user){
		var foundToken,expired;
		if(user!=null) {
			foundToken = _.find(user.services.FMCLogin.tokens, function(item) {return item.token==token});
			if(foundToken!=null) {
				//console.log(foundToken);
				expired = moment(foundToken.expiry).isBefore();
				if(!expired) {
					/*console.log({
						"all good":user
					})*/
					loginWithoutPassword(user,callback);
				}
				else {
					callback(new Meteor.Error('403','login token expired'));
				}
			}
			else {
				callback(new Meteor.Error('403','invalid login token'));
			}
		}
		else {
			callback(new Meteor.Error('403','user token not found'));
		}
	})
}
