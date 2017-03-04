import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Users } from '/modules/models/Users';

import './EmailDigestRow.jsx';

import moment from 'moment';

function getMessagesThisHour( user ) {

	import { Messages } from '/modules/models/Messages';

	let oneHourAgo = moment().subtract( 1, 'day' );

	console.log( oneHourAgo.toDate() );

	let messages = Messages.findAll( { 
		'inboxId.query._id': user._id,
		createdAt: {
			$gte: oneHourAgo.toDate()
		}
	} );

	return messages;
}

function groupMessages( messages ) {
	if( !_.isArray( messages ) ) {
		throw new Meteor.Error( 'Messages should not be an array' );
	}
	let bundledMessages = _.groupBy( messages, 'verb' );
	return bundledMessages;
}

export default EmailDigestView = React.createClass( {

    mixins: [ReactMeteorData],

    getMeteorData() {
    	let userQuery = this.props.user,
    		user = null,
    		userName = null,
    		verbs = [],
    		groupedMessages = {};

    	if ( userQuery._id ) {
    		user = Users.findOne( userQuery._id );
        	userName = ( user.profile && user.profile.firstName ) ? user.profile.firstName : user.getName()
    	}

    	if( user ) {
    		let messages = getMessagesThisHour( user );
    		groupedMessages = groupMessages( messages );
    		verbs = Object.keys( groupedMessages );
    	}

    	return { userName, verbs, groupedMessages };
    },

    render() {
    	let { userName, verbs, groupedMessages } = this.data;

        return(

            <div>

                <p>Hi {userName},</p>

                <p>There has been new activity in your FM Clarity account in the last hour:</p>

                { verbs.map( ( verb, idx ) => {
                	let messages = groupedMessages[ verb ];
                	return (
                		<div key = { idx }>
	                		<p>The following requests have been { verb }:</p>
		                	{ messages.map( ( message, idy ) => {
			                	return <EmailDigestRow key = {idy} message = { message }/>
        		        	} ) }
        	        	</div>
        	        )
                } ) }

            </div>

        )
    }
} )