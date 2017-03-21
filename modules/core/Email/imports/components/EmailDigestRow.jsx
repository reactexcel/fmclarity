import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import moment from 'moment';

export default EmailDigestRow = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        import { Facilities } from '/modules/models/Facilities';
        import { Messages } from '/modules/models/Messages';
        import { Users } from '/modules/models/Users';

        let message = this.props.message,
            target = null,
            facility = null,
            owner = null;

        if ( message ) {
            target = message.getTarget();
            if ( target ) {
                if ( target.owner && target.owner._id ) {
                    owner = Users.findOne( target.owner._id );
                }
                if ( target.facility && target.facility._id ) {
                    facility = Facilities.findOne( target.facility._id );
                }
            }
        }
        return { message, facility, owner }
    },

    render() {
        let {  message, facility, owner } = this.data,
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