import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
// import { Teams } from '/modules/models/Teams';
// import { Users } from '/modules/models/Users';

import moment from 'moment';

const SupplierInviteEmailTemplate = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        import { Teams } from '/modules/models/Teams';
        import { Users } from '/modules/models/Users';

        let { team, inviter, user, token } = this.props;
        secret = null,
            expiry = null;

        if ( team && team._id ) {
            team = Teams.findOne( team._id );
        }
        if ( inviter && inviter._id ) {
            inviter = Teams.findOne( inviter._id );
        }
        if ( user && user._id ) {
            user = Users.findOne( user._id );
        }
        if ( token ) {
            secret = this.props.token.token;
            expiry = this.props.token.expiry;
        }

        return { team, inviter, user, secret, expiry }
    },

    render() {
        let { team, inviter, user, secret } = this.data,
            expiry = this.data.expiry ? moment( this.data.expiry ).fromNow() : null,
            url = Meteor.absoluteUrl( 'enroll-account/' + secret ),
            userName = ( user.profile && user.profile.firstName ) ? user.profile.firstName : user.getName();

        return (
            <div style={{padding:"30px", backgroundColor:"#f5f5f5"}}>
                <div style={{
                    border: "1px solid transparent",
                    backgroundColor: "#fff",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    boxShadow: "0px 0px 3px #888",
                    borderRadius: "5px",
                }}>
                    <p style={{textAlign: "justify"}}>
                      Hi {userName},
                    </p>
                    <p style={{textAlign: "justify"}}>
                      You’ve been invited to use FM Clarity by <strong>{inviter.name}</strong> so welcome aboard.
                    </p>
                    <p style={{textAlign: "justify"}}>
                      {inviter.name} use FM Clarity for their facility management processes, including work orders
                      and building compliance. There is no cost for you and your team to use this service.
                    </p>
                    <p style={{textAlign: "justify"}}>
                      We have created your company account and set your access to <strong>"Supplier Manager"</strong>.
                    </p>
                    <p style={{textAlign: "justify"}}>
                      FM Clarity however is not just used to issue work orders but is also used by FMs to <strong>search for </strong>
                      <strong>new suppliers</strong>, just like your company. Think of it like a LinkedIn for suppliers... and it won’t cost
                      you a thing.
                    </p>
                    <p style={{textAlign: "justify"}}>
                      We’ve already created a basic company profile for you which you can access under
                      Settings <span>&#x279C;</span> Edit Team. Jump in there and add a bit of promo material to jazz it up a bit but most
                      importantly, upload your compliance documents, eg insurances and SWMS, so that FMs can
                      quickly contract you should they require.
                    </p>
                    <p style={{textAlign: "justify"}}>
                      You can also add any staff from here so that you can assign jobs to them.
                    </p>
                    <p style={{textAlign: "justify"}}>
                      To finalise your account activation, please click <strong><a href={url} style={{textDecoration: "none"}}>here</a></strong> where you will be prompted to change
                      your password. You then can access your work orders, complete your company profile and
                      upload your documents.
                    </p>
                    <p style={{textAlign: "justify"}}>
                      If you need any help, a user guide can be found <a href="https://app.fmclarity.com/documentation/FM Clarity Supplier User Guide.pdf">here</a> which has help screens.
                      If your answer isn’t there, please contact us <strong><a href="mailto:support@fmclarity.com?" style={{textDecoration: "none"}}>support@fmclarity.com</a></strong> or phone on <strong> (03) 8376 6333</strong>.
                    </p>
                    <br/>
                    <p style={{textAlign: "justify"}}>
                      <strong>Cheers from the team at FM Clarity</strong><br/>
                      <a href="https://www..fmclarity.com" style={{textDecoration: "none"}}>fmclarity.com</a>
                    </p>
                </div> </div>
        );
    }
} );

export default SupplierInviteEmailTemplate;
