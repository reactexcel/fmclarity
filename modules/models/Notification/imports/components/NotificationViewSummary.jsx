import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

import { ContactAvatarSmall } from '/modules/model-mixins/Members';

export default NotificationViewSummary = React.createClass({
/*
    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, message, owner;
        query = this.props.item;
        message = Messages.findOne(query);
        if(message) {
            owner = message.getOwner()
        }
        return {
            owner:owner,
            message:message
        }
    },

	render() {
        var message = this.data.message||{};
        var owner = this.data.owner||Meteor.user();
        var createdAt = message.createdAt;
		return (
            <div>
            	<ContactAvatarSmall item={owner}/>
                <small>{moment(message.createdAt).fromNow()}</small>
                <div>
                    <strong>{owner.getName()}</strong> {
                    message.verb?
                        <span>{message.verb} <b><a href={message.getTargetUrl()}>{message.getTargetName()}</a></b></span>
                    :
                        <span>{message.subject}</span>
                    }<br/>
                </div>
            </div>
		)
	}
    */

    render() {
        // action arguments are going to have to be sent as an object
        //  they can then be checked using action.type
        let notification = this.props.item,
            { actor, action, object } = notification,
            target = object?object[0]:{};


        console.log(this.props.item);

        return (
            <div>
                <ContactAvatarSmall item = { actor }/>
                <small>{moment(notification.createdAt).fromNow()}</small>
                <div>
                    <strong>{actor.profile.name}</strong>&nbsp;
                    <span>{action.name}</span>&nbsp;
                    <strong><a href="">{target?(target.name||target.profile.name):''}</a></strong>
                    <br/>
                </div>
            </div>            
        )
    }
})