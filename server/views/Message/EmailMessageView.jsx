import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

EmailMessageView = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, message, user, owner, target, facility;
        query = this.props.item;

        user = Users.findOne(this.props.user._id);
        message = Messages.findOne(query);
        if(message) {
            owner = message.getOwner();
            target = message.getTarget();
            if(target&&target.getFacility) {
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
                {owner.getName()} has {message.verb} work request <i>{message.getTargetName()}</i> {facility?<span>at {facility.getName()}</span>:null}.
                {message.body?<span> {owner.getName()} writes:</span>:null}
                </p>

                {message.body?<blockquote>{message.body}</blockquote>:null}

                <p>Click <a href={message.getAbsoluteTargetUrl()}>here</a> to view.</p>
                {owner.profile.phone?<p>{owner.getName()} can be contacted on {owner.profile.phone} shoud you require.</p>:null}
            </div>
        )
    }
});