import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Facilities } from '/modules/models/Facilities';
import { Messages } from '/modules/models/Messages';

export default EmailDigestRow = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        let message = this.props.message,
            target = null,
            facility = null;

        if ( message ) {
            target = message.getTarget();
            if ( target && target.getFacility ) {
                facility = target.getFacility();
            }
        }
        return { message, facility }
    },

    render() {
        let {  message, facility } = this.data,
            url = message.getAbsoluteTargetUrl();

        return (
            <div>
	            <a href = {url}><i>{ message.getTargetName() }</i> { facility?<span>at { facility.getName() }</span>:null }</a>
	            { message.body ? <blockquote>{ message.body }</blockquote> : null }
            </div>
        )
    }
} )
