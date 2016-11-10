import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Facilities } from '/modules/models/Facilities';
import { Messages } from '/modules/models/Messages';

const EmailMessageView = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, message, user, owner, target, facility;
        query = this.props.item;

        user = Meteor.users.findOne(this.props.user._id);
        message = Messages.findOne(query);
        if(message) {
            owner = message.getOwner();
            target = message.getTarget();
            if(target&&target.getFacility) {
                //I have a concern that this could be blocked by RBAC
                //if the user sending the email does not have access
                facility = target.getFacility();
            }
        }
        return {
            user:user,
            owner:owner,
            inbox:this.props.inbox,
            message:message,
            facility:facility
        }
    },

    render() {
        var message = this.data.message||{};
        var facility = this.data.facility;
        var owner = this.data.owner;
        var user = this.data.user;
        var userName = (user.profile&&user.profile.firstName)?user.profile.firstName:user.getName()
        var createdAt = message.createdAt;
        return(
            <div>
                <p>Hi {userName},</p>

                <p>
                {owner.getName()} has {message.verb} <i>{message.getTargetName()}</i> {facility?<span>at {facility.getName()}</span>:null}.
                {message.body?<span> {owner.getName()} writes:</span>:null}
                </p>

                {message.body?<blockquote>{message.body}</blockquote>:null}

                <p>Click <a href={message.getAbsoluteTargetUrl()}>here</a> to reply to the work order.</p>
                {owner.profile.phone?<p>If the matter is urgent, {owner.getName()} can be contacted on {owner.profile.phone}.</p>:null}
            </div>
        )
    }
});

/*
const EmailMessageView = React.createClass( {

    mixins: [ReactMeteorData],

    getMeteorData() {

        let { action, actor, object, result, recipient } = this.props.notification,
            facility = null;

        if ( actor && actor._id ) {
            actor = Meteor.users.findOne( actor._id );
        }

        if ( result && result.facility && result.facility._id ) {
            facility = Facilities.collection.findOne( result.facility._id );
        }

        let recipientName = recipient.profile.name,
            actorName = actor.profile.name;

        return { recipient, recipientName, actor, actorName, action, result, facility }
    },

    render() {

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
*/
export default EmailMessageView;
