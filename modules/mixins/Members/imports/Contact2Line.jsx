import React from "react";

export default function Contact2Line( props ) {
	let contact = props.item,
		profile = {},
		role = props.role,
		hasTenancy = false,
		tenancy = [],
		facility_name = "",
		level = "",
		apartment = "";

	if ( contact ) {
		profile = contact.getProfile ? contact.getProfile() : contact;
		/*if ( profile ) {
			tenancy = profile.tenancy;
		}*/
		if (profile.facility) {
			tenancy.push(profile.facility.name);
			hasTenancy = true;
		}
		if (profile.level) {
			tenancy.push(profile.level.name);
			hasTenancy = true;
		}
		if (profile.apartment) {
			tenancy.push(profile.apartment.name);
			hasTenancy = true;
		}
		var formatted_tenancy = tenancy.join();
	}

	return (
		<span className="contact-card-2line-text">
			<span className="contact-card-line-1">{profile.name}</span>

			{
			hasTenancy?
			<span>&nbsp;<i className="fa fa-home"></i>&nbsp;{formatted_tenancy}</span>
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
