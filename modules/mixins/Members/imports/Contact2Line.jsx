import React from "react";

export default function Contact2Line( props ) {
	let contact = props.item,
		profile = {},
		role = props.role,
		tenancy = "",
		tenancyVariables = [],
		facility_name = "",
		level = "",
		apartment = "";

	if ( contact ) {
		profile = contact.getProfile ? contact.getProfile() : ( contact.profile ? contact.profile : contact );
		if ( profile ) {
			tenancy = profile.tenancy;
		}
		if (profile.facility || contact.facility ) {
			tenancyVariables.push( ( profile.facility ? profile.facility.name : contact.facility.name ) );
		}
		if (profile.level || contact.level) {
			tenancyVariables.push( profile.level ? profile.level.name : contact.level.name);
		}
		if (profile.apartment || contact.apartment) {
			tenancyVariables.push(profile.apartment ? profile.apartment.name : contact.apartment.name);
		}
		if (profile.identifier || contact.identifier) {
			tenancyVariables.push(profile.identifier ? profile.identifier.name : contact.identifier.name);
		}
		var resident_tenancy = tenancyVariables.join();

		if ( role == "resident" ) {
		tenancy = resident_tenancy
		}
	}



	return (
		<span className="contact-card-2line-text">
			<span className="contact-card-line-1">{profile.name}</span>

			{
			tenancy?
			<span>&nbsp;<i className="fa fa-home"></i>&nbsp;{tenancy}</span>
			:null
			}

			{
			role?
			<span className="label label-default pull-right">{role}</span>
			:null
			}

			<br/>
	        <span className="contact-card-line-2">

	        {
	        profile.email?
	        <span><i className="fa fa-envelope"></i>&nbsp;{profile.email}</span>

	        :profile.phone?
	        <span>&nbsp;<i className="fa fa-phone"></i>&nbsp;{profile.phone}</span>

			:profile.phone2?
			<span>&nbsp;<i className="fa fa-phone"></i>&nbsp;{profile.phone2}</span>

	        :null
	        }

	        </span>
	    </span>
	)
}
