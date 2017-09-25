import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Users } from '/modules/models/Users';

import './EmailDigestRow.jsx';

import moment from 'moment';


function groupMessages( messages ) {
    if ( !_.isArray( messages ) ) {
        throw new Meteor.Error( 'Messages should not be an array' );
    }
    let bundledMessages = _.groupBy( messages, 'verb' );
    return bundledMessages;
}

export default EmailDigestView = React.createClass( {

    render() {
        let { user, messages } = this.props,
            userName = ( user.profile && user.profile.firstName ) ? user.profile.firstName : user.getName(),
            groupedMessages = groupMessages( messages ),
            verbs = Object.keys( groupedMessages );

        return (

            <div>

                <p>Hi {userName},</p>

                <p>There has been new activity in your FM Clarity account in the last hour:</p>

                { verbs.map( ( verb, idx ) => {
                    let messages = groupedMessages[ verb ];
                    return (
                        <div key = { idx }>
                            <p>The following requests have been { verb }:</p>
                            { messages.map( ( message, idy ) => {
                                return <EmailDigestRow key = {idy} message = { message } recipient = { user }/>
                            } ) }
                        </div>
                    )
                } ) }

            </div>

        )
    }
} )
