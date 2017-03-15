import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import moment from 'moment';

export default EmailDigestRow = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        import { Facilities } from '/modules/models/Facilities';
        import { Messages } from '/modules/models/Messages';
        import { Users } from '/modules/models/Users';

        let message = null,
            target = null,
            facility = null,
            owner = null;

        if( this.props.message && this.props.message._id ) {
            message = Messages.findOne( this.props.message._id );
        }

        if ( message ) {
            owner = message.getOwner();
            target = message.getTarget();
            if ( target && target.getFacility ) {
                //I have a concern that this could be blocked by RBAC
                //if the user sending the email does not have access
                facility = target.getFacility();
            }
        }
        return { message, facility, owner }
    },

    render() {
        let { message, facility, owner } = this.data,
            url = message.getAbsoluteTargetUrl();

        return (
            <div>
                <a href = {url}>
                    { /*<b>{ moment(message.createdAt).format('hh:mm a') } - </b>*/ }
                    { owner ? <span>{ owner.getName() } { message.verb }&nbsp;</span> : null }
                    <i>{ message.getTargetName() }&nbsp;</i>
                    { facility ? <span>at { facility.getName() }&nbsp;</span> : null }
                </a>
                { false&&message.body ? <blockquote>{ message.body }</blockquote> : null }
            </div>
        )
    }

} )
