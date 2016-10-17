import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Facilities } from '/modules/models/Facilities';

const EmailMessageView = React.createClass( {

    mixins: [ReactMeteorData],

    getMeteorData() {

        console.log( '--------------------' );
        console.log( this.props );
        console.log( '--------------------' );

        let { action, actor, object, result, recipient } = this.props.notification,
            facility = null;

        if ( actor && actor._id ) {
            actor = Meteor.users.findOne( actor._id );
        }

        if ( result && result.facility && result.facility._id ) {
            facility = Facilities.findOne( result.facility._id );
        }

        let recipientName = recipient.profile.name,
            actorName = actor.profile.name;

        return { recipient, recipientName, actor, actorName, action, result, facility }
    },

    render() {

        console.log( this.data );

        let { recipient, recipientName, actor, actorName, action, result, facility } = this.data,
            body = null;

        return (
            <div>
                <p>Hi {recipientName},</p>

                <p>
                {actorName} has {action.verb} <i>{result.name}</i> {facility?<span>at {facility.name}</span>:null}.
                {body?<span> {actorName} writes:</span>:null}
                </p>

                {body?<blockquote>{body}</blockquote>:null}

                <p>Click <a href="">here</a> to reply to the work order.</p>
                {actor.profile.phone?<p>If the matter is urgent, {actorName} can be contacted on {actor.profile.phone}.</p>:null}
            </div>
        )
    }
} )

export default EmailMessageView;
