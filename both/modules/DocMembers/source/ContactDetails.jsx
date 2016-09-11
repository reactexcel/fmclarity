import React from "react";

export default function ContactDetails( props ) {
    var contact, contactName;
    var contact = props.item;
    if ( contact != null ) {
        contactName = contact.getName ? contact.name : contact.name;
        contact = contact.getProfile ? contact.getProfile() : contact;
    }
    if ( !contact ) {
        return <div/>
    }
    return (
        <div className="contact-info">

        {contactName?
        <span className="contact-title">Contact: {contactName}<br/></span>
        :null}

        <span><i className="fa fa-envelope"></i> {contact.email}<br/></span>

        {contact.phone?
        <span><i className="fa fa-phone"></i> {contact.phone}<br/></span>
        :null}

        {contact.phone2?
        <span><i className="fa fa-phone"></i> {contact.phone2}<br/></span>
        :null}

    </div>
    )
}
