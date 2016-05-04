Accounts.emailTemplates.siteName = "FM Clarity";
Accounts.emailTemplates.from = "FM Clarity<no-reply@fmclarity.com>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
  var name = user.profile.name;
  var team = Teams.findOne({
    members:{$elemMatch:{_id:user._id}}
  });

  return team.name+" has invited you to join FM Clarity";
};
Accounts.emailTemplates.enrollAccount.text = function(user,url) {
  var name = user.profile.name;
  var team = Teams.findOne({
    members:{$elemMatch:{_id:user._id}}
  });

  var str = "Hi "+name+",\n\n";
  str+= team.name + " has set up FM Clarity web-based software to make it easy to manage facility processes. "
  str+="As a member of the facility management team, an account has been created for you to give you access to the system.\n\n"
  str+= "Quick info: what do I need to do to get setup?\n\n";
  str+="1. Click the link at the bottom of this email\n";
  str+="2. Change your password\n";
  str+="3. Follow the walkthrough";
  str+="\n\n"+url;
  return str;
}

Accounts.urls.enrollAccount = function (token) {
    if(FM.inProduction()) {
      return Meteor.absoluteUrl('enroll-account/' + token,{rootUrl:"https://app.fmclarity.com"});
    }
    else {
      return Meteor.absoluteUrl('enroll-account/' + token,{rootUrl:"http://52.62.240.180:3000"});
    }
};

Accounts.urls.resetPassword = function (token) {
    if(FM.inProduction()) {
      return Meteor.absoluteUrl('reset-password/' + token,{rootUrl:"https://app.fmclarity.com"});
    }
    else {
      return Meteor.absoluteUrl('reset-password/' + token,{rootUrl:"http://52.62.240.180:3000"});
    }
};




Meteor.startup(function(){

    var smtpUsername = "AKIAIPJKWHGNFC75EL3Q";
    var smtpPassword = "AjuszCYXste2nI8Y8SrH+3vpo0+4lCJ0KA4HtBUAgd0m";

	process.env.ROOT_URL = 'https://app.fmclarity.com';
    process.env.MAIL_URL = "smtp://"+smtpUsername+":"+
    encodeURIComponent(smtpPassword)+
    "@email-smtp.us-west-2.amazonaws.com:465/";

    /*Accounts.emailTemplates.enrollAccount.text = function (user, url) {
       return "You have been selected to participate in building a better future!"
         + " To activate your account, simply click the link below:\n\n"
         + url;
    };*/

    /*Email.send({
      to: 'leo@fmclarity.com',
      from: 'no-reply@fmclarity.com',
      subject: 'Your new car',
      text: 'ummmm'
    });*/
});

Meteor.methods({


	sendEmail: function (to, from, subject, text) {
	    check([to, from, subject, text], [String]);

	    // Let other method calls from the same client start running,
	    // without waiting for the email sending to complete.
	    this.unblock();

      var cc = "leo@fmclarity.com;rich@fmclarity.com";

	    //actual email sending method
	    Email.send({
	      //to: to,
        cc: cc,
	      from: from,
	      subject: subject,
	      text: text
	    });
	},

  resetTestData() {
    console.log('Resetting test data...');
    FM.resetTestData();
  }
});