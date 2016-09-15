import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

export default PasswordResetEmailTemplate = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var user,secret,expiry;
        if(this.props.user)
            user = Users.findOne(this.props.user._id);
        if(this.props.token) {
            secret = this.props.token.token;
            expiry = this.props.token.expiry;
        }
        return {
            user:user,
            secret:secret,
            expiry:expiry
        }
    },

    render() {
        var user = this.data.user;
        var secret = this.data.secret;
        var expiry = this.data.expiry?moment(this.data.expiry).fromNow():null;
        var url = Meteor.absoluteUrl('reset-password/'+ secret);
        var userName = (user.profile&&user.profile.firstName)?user.profile.firstName:user.getName();
        return(
            <div>
                <p>Hi {userName},</p>

                <p>

                    To reset your password, simply click the link below.<br/><br/>
                    <a href={url}>{url}</a><br/><br/>
                    Thanks.

                </p>
            </div>
        )
    }
});