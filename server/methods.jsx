Accounts.emailTemplates.siteName = "FM Clarity";
Accounts.emailTemplates.from = "no-reply@fmclarity.com";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to FM Clarity, " + user.profile.name;
};
Accounts.urls.enrollAccount = function (token) {
    return Meteor.absoluteUrl('enroll-account/' + token,{rootUrl:"http://fmclarity.com:3000"});
};




Meteor.startup(function(){

    var smtpUsername = "AKIAIPJKWHGNFC75EL3Q";
    var smtpPassword = "AjuszCYXste2nI8Y8SrH+3vpo0+4lCJ0KA4HtBUAgd0m";

	process.env.ROOT_URL = 'http://htpc:3000';
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

	    //actual email sending method
	    Email.send({
	      to: to,
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