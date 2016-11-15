import React from "react";
import {ReactMeteorData} from 'meteor/react-meteor-data';

import moment from 'moment';


const SupplierRequestEmailView = React.createClass({

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
            url = Meteor.absoluteUrl('u/'+ secret + '/' + request.getEncodedPath());
        }
        else {
            url = request.getUrl();
        }

        var dueDate = moment(request.dueDate).format('MMMM Do YYYY, h:mm:ss a');
        var expiry = this.data.expiry?moment(this.data.expiry).fromNow():null;

        return(
            <div>
                <p>Hi{recipientName},</p>
                <p>{team.getName()} has just issued you a work order <a href={url}>#{request.code} - {request.getName()} at {facility.getName()}</a>.</p>
                <p>The priority is listed as {request.priority} and it is due to be completed by {dueDate}.</p>
                <p>To access full details of the work order, please click the above link (no login required).&nbsp; 
                {expiry?<span>This link will expire {expiry}</span>:null}.
                </p>
                <p>Any comments, images or files can be uploaded to the work order via the above link.</p>
                <p>Please ensure you close out the work order once completed by clicking the close button on the work order. Any additional works required, including a quote if you have it available, can also be added at this time.</p>
                {/*<p>For details of the work order terms and conditions please visit this link [supplier external link].</p>*/}
                <p>Please contact {team.getName()} should you have any queries.</p>
                <p>Best regards,<br/>{team.getName()}</p>
            </div>
        )
    }
});

export default SupplierRequestEmailView;