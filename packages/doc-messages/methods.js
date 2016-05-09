import React from 'react';
import ReactDOMServer from 'react-dom/server';

Meteor.methods({
	//probably Messages.markAllNotificationsRead
  'Messages.markAllNotificationsAsRead':function(inboxId) {
    Messages.update({
      "inboxId.collectionName":inboxId.collectionName,
      "inboxId.query":inboxId.query,
      read:false
    },{
      $set:{read:true}
    },{
      multi:true
    });
  },

  //no reason why this can't be Messages.sendEmail hey??
  'Messages.sendEmail':function(user,message) {
    if(Meteor.isServer) {Meteor.defer(function(){

      /*
      if(!FM.inProduction()) {
        console.log('development');
      }
      else {
        console.log('production');
      }
      */
      if(user&&user.emails) {

        var element = React.createElement(EmailMessageView,{user:user,item:message});
        var html = ReactDOMServer.renderToStaticMarkup (element);
        var address = user.emails[0].address;
        var to = user.name?(user.name+" <"+address+">"):address;
        var subject = (message.subject||"FM Clarity notification");

        var email, devMsg;

        devMsg = {
          to:["leo@fmclarity.com","rich@fmclarity.com"]
        }

        if(FM.inProduction()) {

          email = {
              to:to,
              from:"FM Clarity <no-reply@fmclarity.com>",
              subject:subject,
              html:html
          }
          Email.send(email);

          devMsg.from = "FM Outgoing Message Alert <no-reply@fmclarity.com>";
          devMsg.subject = "["+to+"]"+subject;
          devMsg.html = 
            "***Message sent to "+to+"***<br/><br/>"+
            html+
            "<br/>******<br/>"+
            JSON.stringify(message)+"<br/>"
            //JSON.stringify(email)+"<br/>";
        }

        else {
          devMsg.from = "FM Test Message <no-reply@fmclarity.com>";
          devMsg.subject = "["+to+"]"+subject;
          devMsg.html = 
            "***Test message intercepted for:"+to+"***<br/><br/>"+
            html+
            "<br/>******<br/>"+
            JSON.stringify(message)+"<br/>"
        }

        Email.send(devMsg);
      }
    })}
  }
})
