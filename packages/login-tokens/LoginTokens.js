// can we include all login functionality in this package?
// including the login forms and the rest?

FMCLogin = {
	generateLoginToken:generateLoginToken,
	loginWithToken:loginWithToken,
	getUrl:getUrl
}

Meteor.methods({
	"FMCLogin.insertLoginToken":function(userId,token){
		Meteor.users.update(userId,{$push:{'services.FMCLogin.tokens':token}});
	},
	"FMCLogin.generateAccountToken":function(user) {
		if(Meteor.isServer) {
			var stampedLoginToken = Accounts._generateStampedLoginToken();
			Accounts._insertLoginToken(user._id, stampedLoginToken);
			return stampedLoginToken.token;
		}
	},
	"FMCLogin.findUserFromToken":function(token){
		return Meteor.users.findOne({'services.FMCLogin.tokens':{$elemMatch:{token:token}}});
	}
})

function generateLoginToken(user,expiry,redirect) {
	var now = new Date();
	var expiry = expiry||moment().add({days:14}).toDate();
	var redirect = redirect||'/';
	var token = {
		token:Random.secret(),
		when:now,
		expiry:expiry,
		redirect:redirect
	}
	Meteor.call("FMCLogin.insertLoginToken",user._id,token);
	return token;
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
					console.log({
						"all good":user
					})
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
