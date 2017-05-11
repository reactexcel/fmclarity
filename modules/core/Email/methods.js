import React from 'react';
import ReactDOMServer from 'react-dom/server';
import EmailMessageView from './imports/components/EmailMessageView.jsx';
import { LoginService } from '/modules/core/Authentication';

import moment from 'moment';

Meteor.methods( {
    //probably Messages.markAllNotificationsRead
    'Messages.markAllNotificationsAsRead': function( inboxId ) {
        Messages.update( {
            "inboxId.collectionName": inboxId.collectionName,
            "inboxId.query": inboxId.query,
            read: false
        }, {
            $set: { read: true }
        }, {
            multi: true
        } );
    },

    'Messages.composeEmail': function( args ) {
        if ( Meteor.isServer ) {
            var recipient = args.recipient;
            var subject = args.subject;
            var Template = args.template;
            var params = args.params;
            var element = React.createElement( Template, params );
            var emailBody = ReactDOMServer.renderToStaticMarkup( element );
            //console.log(emailBody);
            Meteor.call( 'Messages.sendEmail', recipient, {
                subject: subject,
                emailBody: emailBody
            } )
        }
    },

    /**
     * @function    sendEmail
     * @param       {Document} user
     * @param       {object} message
     * 
     * Converts the provided message object into an email message and sends it to the provided users email address
     *     
     */
    'Messages.sendEmail': function( user, message ) {
        // runs only on server
        if ( !Meteor.isServer ) {
            return;
        }

        if ( !user ) {
            throw Meteor.Error( 'Attempted to send email to non-existant user' )
        }

        if ( !user.emails ) {
            throw Meteor.Error( 'Attempted to send email to a user with no addresses' );
        }

        // create a moment obj representing expiry data (14 days in future)
        let expiry = moment( new Date() ).add( { days: 14 } ).toDate();

        // make a login token which expires at "expiry"
        let token = LoginService.generateLoginToken( user, expiry );

        // a react element using the provided message object
        let element = React.createElement( EmailMessageView, { user: user, item: message, token: token } );

        let subject = ( message.subject || "FM Clarity notification" );
        // if a emailBody property is provided in the message then use that
        // ( this can be useful if you want to render the body with a custom element )
        let html = ( message.emailBody || ReactDOMServer.renderToStaticMarkup( element ) );

        let to = user.name ? ( user.name + " <" + user.profile.email + ">" ) : user.profile.email;

        // a message notification object which specifies message sent to developers
        let devMsg = {};

        if ( FM.inProduction() ) {

            // defer prevents blocking if multiple messages sent
            Meteor.defer( function() {
                Email.send( {
                    to: to,
                    from: "FM Clarity <no-reply@fmclarity.com>",
                    subject: subject,
                    html: html
                } );
            } );

            devMsg.to = [ "leo@fmclarity.com", "rich@fmclarity.com" ];
            devMsg.from = "FM Outgoing Message Alert <no-reply@fmclarity.com>";
            devMsg.subject = "[" + to + "]" + subject;
            devMsg.html =
                "***Message sent to " + to + "***<br/><br/>" +
                html +
                "<br/>******<br/>" +
                JSON.stringify( message ) + "<br/>"
        } else {
            devMsg.to = [ "ttest.55.0.54@gmail.com" ];
            devMsg.from = "FM Test Message <no-reply@fmclarity.com>";
            devMsg.subject = "[" + to + "]" + subject;
            devMsg.html =
                "***Test message intercepted for:" + to + "***<br/><br/>" +
                html +
                "<br/>******<br/>" +
                JSON.stringify( message ) + "<br/>"
        }

        Meteor.defer( function() {
            console.log( { "sending email to": to } );
            Email.send( devMsg );
        } );
    }
} )
