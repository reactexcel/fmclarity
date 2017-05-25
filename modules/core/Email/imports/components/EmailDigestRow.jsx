import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import moment from 'moment';

export default EmailDigestRow = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        import { Facilities } from '/modules/models/Facilities';
        import { Messages } from '/modules/models/Messages';
        import { Users } from '/modules/models/Users';
        import { LoginService } from '/modules/core/Authentication';

        let message = null,
            target = null,
            facility = null,
            secret = null,
            owner = null;

        if( this.props.message && this.props.message._id ) {
            message = Messages.findOne( this.props.message._id );
        }

        if ( message ) {
            if ( message.owner && message.owner._id ) {
                owner = Users.findOne( message.owner._id );
            }
            target = message.getTarget();
            if ( target && target.facility && target.facility._id ) {
                facility = Facilities.findOne( target.facility._id );
            }
        }
        if (owner) {
            
            let expiry = moment( new Date() ).add( { days: 14 } ).toDate();

            let token = LoginService.generateLoginToken( owner, expiry );
            secret = token.token;
        }
        return { message, facility, owner, secret }
    },

    render() {
        let { message, facility, owner, secret } = this.data,
            url = message.getAbsoluteTargetUrl();
            if(secret) {
                url = Meteor.absoluteUrl('u/'+ secret + '/' + message.getEncodedAbsoluteTargetUrl() );
            }

        return (
            <div>
                <a href = {url}>
                    { /*<b>{ moment(message.createdAt).format('hh:mm a') } - </b>*/ }
                    { owner ? <span>{ owner.getName() } { message.verb }&nbsp;</span> : null }
                    <i>{ message.getTargetName() }&nbsp;</i>
                    { facility ? <span>at { facility.getName() }&nbsp;</span> : null }
                </a>
                { ( message.verb == 'commented on' && message.body ) ? <blockquote>{ message.body }</blockquote> : null }
            </div>
        )
    }

} )
