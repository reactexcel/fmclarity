import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Messages from './Messages.jsx';

export default DocMessages = {
    register,
    isValidEmail,
    render
}

var defaultHelpers = {
    distributeMessage: distributeMessage,
    sendMessage: distributeMessage,
    markAllNotificationsAsRead: markAllNotificationsAsRead,
    getInboxName: getInboxName,
    getInboxId: getInboxId,
    getNotifications: getNotifications,
    getMessageCount: getMessageCount,
    //getRecipients:getRecipients,
}

function register( collection, opts ) {
    opts = opts || {};
    var authentication = opts.authentication || true;
    var customHelpers = opts.helpers || {};

    var helpers = _.extend( {
        collectionName: collection._name
    }, defaultHelpers, customHelpers );


    collection.helpers( helpers );

    collection.actions( {
        getMessages: {
            authentication: authentication,
            helper: function( inbox, options ) {
                options = options || {
                    sort: {
                        createdAt: 1
                    }
                };
                return Messages.find( {
                    "inboxId.collectionName": inbox.collectionName,
                    "inboxId.query._id": inbox._id,
                }, options ).fetch();
            }
        }
    } )

}

//this is repeated accross all of my document packages
//should I write some sort of mixin to handle this functionity
//RegisterFMCDocumentService????
//Or some sort of class inheritance structure
function getConfigurationFunction( options ) {
    return function( collection ) {
        registerCollection( collection, options );
    }
}

//would be nice to encapsulate the above in some sort of config file (could it be package.js???)
// and keep the functions below compartmentalised
///---------------------------------------------------------------------

function render( view, params ) {
    var element = React.createElement( view, params );
    return ReactDOMServer.renderToStaticMarkup( element );
}

function isValidEmail( email ) {
    var temp = email.split( '@' );
    var name = temp[ 0 ];
    var server = temp[ 1 ];
    //return ucfirst name
    return name.charAt( 0 ).toUpperCase() + name.slice( 1 );
}

//gets all recipients of the message
function getRecipients( inCC, outCC ) {
    outCC = outCC || [];
    inCC.map( function( c ) {
        if ( c ) {
            outCC.push( c );
            if ( c.getWatchers ) {
                getRecipients( c.getWatchers(), outCC );
            }
        }
    } )
    return outCC;
}

function flattenRecipients( cc ) {
    var recipients = getRecipients( cc );
    recipients = _.uniq( recipients, false, function( i ) {
        return i._id;
    } )
    return recipients;
}


function distributeMessage( { recipientRoles, message, suppressOriginalPost } ) {

    if ( !message ) {
        console.log( 'No message to send...' );
        return;
    }

    var user = Meteor.user();
    var obj = this;
    message.target = obj.getInboxId();
    message.owner = {
            _id: user._id,
            name: user.getName()
        }
        //add message/notification to original sending object
    if ( !suppressOriginalPost ) {
        sendMessage( message, obj );
    }
    //scan through the list of recipientRoles and process them
    // if string treat as role name, is obj treat as recipient proper
    //console.log(recipientRoles);
    var recipients;
    if ( recipientRoles ) {
        recipients = getRecipientListFromRoles( obj, recipientRoles );
    } else {
        recipients = this.getWatchers();
        recipients = flattenRecipients( recipients );
    }

    recipients = _.uniq( recipients, false, function( i ) {
        if ( i ) {
            return i._id;
        }
    } )

    //console.log(recipients);
    recipients.map( function( r ) {
        if ( r ) {
            console.log( {
                "sending notification to": r.profile?r.profile.name:r.name
            } );
            sendMessage( message, r );
        } else {
            console.log( "I tried to send a message to a nonexistent entitiy" );
        }
    } )
}

function getRecipientListFromRoles( obj, roles ) {
    var recipients = [];
    roles.map( function( role ) {
        if ( role == "team" && obj.team != null ) {
            recipients.push( obj.team );
        }
        //else if we are sending it to facility
        else if ( role == "facility" && obj.facility ) {
            recipients.push( obj.facility );
        }
        //else if we are sending it to the member with "role"
        else if ( obj.getMembers ) {
            recipients = recipients.concat( obj.getMembers( {
                role: role
            } ) )
        }
    } )
    return recipients;
}

function sendMessageToMembers( obj, message, role ) {
    var team, facility, recipients = [];
    //if we are sending the message to the team
    if ( role == "team" && obj.team != null ) {
        recipients.push( obj.team );
    }
    //else if we are sending it to facility
    else if ( role == "facility" && obj.facility != null ) {
        recipients.push( obj.facility );
    }
    //else if we are sending it to the member with "role"
    else if ( obj.getMembers ) {
        recipients = obj.getMembers( {
            role: role
        } )
    }
    recipients.map( function( r ) {
        //console.log(r);
        sendMessage( message, r );
    } )
}

function recipientIsCreator( message, recipient ) {
    return recipient._id && message.owner._id && recipient._id == message.owner._id
}

function sendMessage( message, recipient ) {
    var msgCopy, emailBody;

    if ( !recipient.getInboxId ) {
        console.log( { 'Attempted to send message to entity with no inbox function': recipient } );
        return;
    }

    //if emailBody is a callback then create the personalised body using the callback
    if ( Meteor.isServer && message.emailBody && _.isFunction( message.emailBody ) ) {
        emailBody = message.emailBody( recipient, message );
    } else {
        emailBody = message.emailBody;
    }

    //make copy of original message using our own personal inboxId
    var msgCopy = _.extend( {}, message, {
        inboxId: recipient.getInboxId(),
        emailBody: emailBody
    } );


    //check if we should mark the message as read
    if ( recipientIsCreator( message, recipient ) ) {
        msgCopy.read = true;
    }

    //create the message
    Meteor.call( "Messages.create", msgCopy, ( error, response ) => {
        //console.log( { error, response } );
        //then email if we are supposed to
        if ( !msgCopy.read ) {
            Meteor.call( "Messages.sendEmail", recipient, msgCopy );
        }
    } );
}

// I reckon trash getInboxName and make getInboxId explicit in each class that uses it
function getInboxId() {
    return {
        collectionName: this.collectionName,
        query: {
            _id: this._id
        },
        name: this.getInboxName(),
        path: this.path,
    }
}

// I reckon trash getInboxName and make getInboxId explicit in each class that uses it
function getInboxName() {
    return this.getName() + "'s" + " inbox";
}

function getMessageCount( opts ) {
    return Messages.find( {
        "inboxId.collectionName": this.collectionName,
        "inboxId.query._id": this._id
    }, opts ).count();
}

function getNotifications( opts ) {
    var hideOwn = opts ? opts.hideOwn : false;
    var q = {
        "inboxId.collectionName": this.collectionName,
        "inboxId.query._id": this._id,
        read: false
    };
    //console.log(q);
    if ( hideOwn ) {
        q[ "$ne" ] = {
            "owner._id": this._id
        };
    }
    return Messages.find( q, {
        sort: {
            createdAt: -1
        }
    } ).fetch();
}

function markAllNotificationsAsRead() {
    Meteor.call( 'Messages.markAllNotificationsAsRead', this.getInboxId() );
}
