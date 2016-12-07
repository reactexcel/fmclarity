/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";
import { ContactAvatarSmall } from '/modules/mixins/Members';
import { Actions } from '/modules/core/Actions';

import moment from 'moment';


/**
 * @class           NotificationViewSummary
 * @memberOf        module:models/Notifications
 */

function NotificationViewSummary( { item } ) {

    let message = item || {},
        owner = message.getOwner() || Meteor.user(),
        createdAt = message.createdAt;


    function performLinkAction( message ) {
        if( message.target.path == 'requests' ) {
            let target = message.getTarget();
            console.log( target );
            Actions.run('view request', target );
        }
    }

    return (
        <div>
            <ContactAvatarSmall item = { owner }/>
            <small>{ moment(message.createdAt).fromNow() }</small>
            <div>
                <strong>{ owner.getName() }</strong> {
                message.verb ?
                    <span>{ message.verb } <b><a onClick = { () => { performLinkAction( message ) } } >{ message.getTargetName() }</a></b></span>
                :
                    <span>{ message.subject }</span>
                }<br/>
            </div>
        </div>
    )
}

/*
function NotificationViewSummary( props ) {
    // action arguments are going to have to be sent as an object
    //  they can then be checked using action.type
    let { actor, action, object, result, createdAt } = props.item,
        target = {},
        actorName = actor.profile.name,
        actionName = action.name,
        actionVerb = Actions.getVerb( action ),
        resultObject = Actions.getResult( action, result ) || {};

    return (
        <div>
            <ContactAvatarSmall item = { actor }/>
            <small>{ moment( result.createdAt ).fromNow() }</small>
            <div>
                <strong>{ actorName }</strong>&nbsp;
                <span>{ actionVerb }</span>&nbsp;
                <strong><a href = {resultObject.href}>{ resultObject.text }</a></strong>
                <br/>
            </div>
        </div>
    )
}
*/

export default NotificationViewSummary;
