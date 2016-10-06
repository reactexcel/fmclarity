/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";
import { ContactAvatarSmall } from '/modules/mixins/Members';

/**
 * @class           NotificationViewSummary
 * @memberOf        module:models/Notifications
 */
function NotificationViewSummary( props ) {
    // action arguments are going to have to be sent as an object
    //  they can then be checked using action.type
    let { actor, action, object, createdAt } = props.item,
        target = {},
        actorName = actor.name,
        actionName = action.name,
        targetName = "Unknown";

    if ( object ) {
        target = object[ 0 ];
    }

    if ( target ) {
        if ( target.profile ) {
            targetName = target.profile.name;
        } else {
            targetName = target.name;
        }
    }

    //console.log(this.props.item);

    return (
        <div>
            <ContactAvatarSmall item = { actor }/>
            <small>{ moment( createdAt ).fromNow() }</small>
            <div>
                <strong>{actorName}</strong>&nbsp;
                <span>{actionName}</span>&nbsp;
                <strong><a href = "">{ targetName }</a></strong>
                <br/>
            </div>
        </div>
    )
}

export default NotificationViewSummary;
