import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import ContactAvatarSmall from './ContactAvatarSmall.jsx';
import Contact2Line from './Contact2Line.jsx';

export default function ContactCard( props ) {

	let contact = props.item,
		profile = props.item,
		group = props.group,
		team = props.team,
		view = null,
		role = null;

	if ( contact.getProfile ) {
		profile = contact.getProfile();
	}

	if ( group != null ) {
		role = RBAC.getRole( contact, props.group );
	} else if ( props.team ) {
		role = RBAC.getRole( contact, props.team );
	}

	return (
		<div className="contact-card contact-card-2line">
			<ContactAvatarSmall item={ contact } />
			<Contact2Line item={ contact } role={ role }/>
        </div>
	)
}
