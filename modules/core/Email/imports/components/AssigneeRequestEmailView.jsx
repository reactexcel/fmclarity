import React from "react";
import {ReactMeteorData} from 'meteor/react-meteor-data';

import moment from 'moment';


const AssigneeRequestEmailView = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        import { Requests } from '/modules/models/Requests';
        var recipient, request, secret, expiry;
        request = Requests.findOne(this.props.item);
        recipient = Meteor.users.findOne(this.props.recipient);
        if(this.props.token) {
            secret = this.props.token.token;
            expiry = this.props.token.expiry;
        }
        return {
            recipient:recipient,
            request:request,
            team:request.getTeam(),
            supplier:request.getSupplier(),
            facility:request.getFacility(),
            secret:secret,
            expiry:expiry,
        }
    },

    render() {
        var recipient = this.data.recipient;    //the recipient (NB:may be a team)

        if(!recipient) {
            return;
        }

        //console.log(recipient);

        var team = this.data.team;              //the issuing team
        var supplier = this.data.supplier;      //the supplier item has been issued to
        var request = this.data.request;
        var facility = this.data.facility;
        var secret = this.data.secret;
        var url;

        var recipientName = "";

        if(recipient.profile&&recipient.profile.firstName) {
            recipientName = " "+recipient.profile.firstName;
        }
        else if(recipient.getName) {
            recipientName = " "+recipient.getName();
        }

        if(secret) {
            url = Meteor.absoluteUrl('u/'+ secret + '/' + request.getEncodedPath() );
        }
        else {
            url = request.getUrl();
        }

        var dueDate = moment(request.dueDate).format('MMMM Do YYYY, h:mm:ss a');
        var expiry = this.data.expiry?moment(this.data.expiry).fromNow():null;

        return(
            <div>
                <p>Hi {recipientName},</p>
                <p>{Meteor.user().getName()} has assigned the following work order for you to action.</p>
                <p><a href={url}>#{request.code} - {request.getName()} at {facility.getName()}</a></p>
                <p>Any queries can be raised in the work order.</p>

            </div>
        )
    }
});

export default AssigneeRequestEmailView;
