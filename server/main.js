import { Meteor } from 'meteor/meteor';

Meteor.startup( function() {
	
	let smtpUsername = "AKIAIPJKWHGNFC75EL3Q",
		smtpPassword = "AjuszCYXste2nI8Y8SrH+3vpo0+4lCJ0KA4HtBUAgd0m";

	process.env.ROOT_URL = 'https://app.fmclarity.com';
	process.env.MAIL_URL = "smtp://" + smtpUsername + ":" + encodeURIComponent( smtpPassword ) + "@email-smtp.us-west-2.amazonaws.com:465/";

} );

FM.inDevelopment = function() {
	return process.env.NODE_ENV === "development" || process.env.METEOR_ENV === "development";
};
FM.inProduction = function() {
	return process.env.METEOR_ENV === "production";
};

var timeInMillis = 1000 * 10; // 10 secs
//FlowRouter.setPageCacheTimeout(timeInMillis);
//FlowRouter.setDeferScriptLoading(true);