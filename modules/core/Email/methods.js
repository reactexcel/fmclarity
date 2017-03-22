import React from 'react';
import ReactDOMServer from 'react-dom/server';
import EmailMessageView from './imports/components/EmailMessageView.jsx';
import { LoginService } from '/modules/core/Authentication';

import moment from 'moment';

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

  'Messages.composeEmail':function(args) {
    if(Meteor.isServer) {
      var recipient = args.recipient;
      var subject = args.subject;
      var Template = args.template;
      var params = args.params;
      var element = React.createElement(Template,params);
      var emailBody = ReactDOMServer.renderToStaticMarkup(element);
      //console.log(emailBody);
      Meteor.call('Messages.sendEmail',recipient,{
        subject:subject,
        emailBody:emailBody
      })
    }
  },

  //no reason why this can't be Messages.sendEmail hey??
  'Messages.sendEmail':function(user,message) {
    if(Meteor.isServer) {

      //console.log( EmailMessageView );

      //check([to, from, subject, text], [String])

      /*
      if(!FM.inProduction()) {
        console.log('development');
      }
      else {
        console.log('production');
      }
      */
      if(user&&user.emails) {

        var subject, html, address, to, email, devMsg;

        var expiry = moment( new Date() ).add( { days: 13 } ).toDate();
        var token = LoginService.generateLoginToken( user, expiry );
        var element = React.createElement(EmailMessageView,{user:user,item:message, token: token});

        //console.log( element );

        subject = (message.subject||"FM Clarity notification");
        html = (message.emailBody||ReactDOMServer.renderToStaticMarkup (element));
        to = user.name?(user.name+" <"+user.profile.email+">"):user.profile.email;

        devMsg = {
          //to:["leo@fmclarity.com", "rich@fmclarity.com"]
          to:["ttest.55.0.54@gmail.com"]
        }

        if(FM.inProduction()) {

          email = {
              to:to,
              from:"FM Clarity <no-reply@fmclarity.com>",
              subject:subject,
              html:html
          }

          Meteor.defer(function(){
            Email.send(email);
          });

          devMsg.from = "FM Outgoing Message Alert <no-reply@fmclarity.com>";
          devMsg.subject = "["+to+"]"+subject;
          devMsg.html =
            "***Message sent to "+to+"***<br/><br/>"+
            html+
            "<br/>******<br/>"+
            JSON.stringify(message)+"<br/>"
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

        Meteor.defer(function(){
          console.log({"sending email to":to});
          Email.send(devMsg);
        });

      }
    }
  }
})
