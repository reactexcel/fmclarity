import React from "react";
import {ReactMeteorData} from 'meteor/react-meteor-data';

import moment from 'moment';


const OverdueWorkOrderEmailView = React.createClass({

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
        var btnStyles = {
					padding: "10px",
					color: "#ffffff",
					backgroundColor: "#337ab7",
					border: "1px solid #2e6da4",
					fontSize: "14px",
          textDecoration: "none",
          marginLeft: "42.5%",
        };
        var divStyles = {
          backgroundColor: "#f5f5f5",
          padding: "20px",
          border: "1px solid #fff",
          borderRadius: "2%"
        };
        var dueDateCount  =  moment( request.dueDate ).fromNow().split(" ");
          dueDateCount = dueDateCount[0] + " " + dueDateCount[1];
        if(!request.firstReminderSent ){
          return(
            <div style={divStyles}>
              <p>Dear{recipientName},</p>
              <p>{team.getName()} requested the below work be completed by <strong>{dueDate}</strong> and it is now overdue.</p>
              <p>#{request.code} - {request.name}</p>
              <p>Please advise ETA via the below link. If this work is completed already,
                 please hit the complete button in the work order and upload or take a pic of the service report.</p>
              <br/>
              <p><a href={url} style={ btnStyles }>CLICK HERE</a></p>
              <br/>
              <p>Thanks for your help in finalising this job.
                Please also upload an invoice to speed up payment at our end.</p>
            </div>
          )
        } else {
          return(
            <div style={divStyles}>
              <p>Attention{recipientName},</p>
              <p>The below work order is now overdue by <strong>{ dueDateCount }</strong>.</p>
              <p>#{request.code} - {request.name}</p>
              <p>We request and would appreciate your attention on this matter urgently to complete this job.
                Please advise ETA via the below link [upon receipt of this email (underlined)] and attend asap.
                If this work is completed already, please hit the complete button in the work order and upload or take a pic of the service report.</p>
              <br/>
              <p><a href={url} style={ btnStyles }>CLICK HERE</a></p>
              <br/>
              <p>Thanks for your help in finalising this job.
                Please also upload an invoice to speed up payment at our end.</p>
            </div>
          )
        }

    }
});

export default OverdueWorkOrderEmailView;
