import React from "react";
import AddressLink from './AddressLink.jsx';

export default function FacilityDetails( props ) {
	if ( !props.item ) {
		return <div/>
	}
	var billingDetails = props.item.billingDetails;
	var teamType = Session.get('selectedTeam').type;

	return (
		<div className="contact-info">
        	<span className="contact-title">Site: {props.item.name}<br/></span>
        	
        	<span><AddressLink item={props.item.address}/><br/></span>

        	{teamType=='contractor' && billingDetails ?
        	<div>
        	<span className="contact-title">Billing Address<br/></span>
        	        	<ul>
        	        	{billingDetails.company ? <li><i className="fa fa-location-arrow"></i>Company: {billingDetails.company}</li> : null}
        	        	{billingDetails.address_1 ? <li><i className="fa fa-phone"></i>Address 1: {billingDetails.address_1}</li> : null}
        	        	{billingDetails.address_2 ? <li><i className="fa fa-phone"></i>Address 2: {billingDetails.address_2}</li> : null}
        	        	{billingDetails.suburb ? <li><i className="fa fa-building"></i>Suburb: {billingDetails.suburb}</li> : null}
        	        	{billingDetails.state ? <li><i className="fa fa-map-marker"></i>State: {billingDetails.state}</li> : null}
        	        	{billingDetails.postcode ? <li><i className="fa fa-calculator"></i>Postcode: {billingDetails.postcode}</li> : null}
        	
        	        	</ul>
        	</div>
        	:null}
        	
    	</div>
	)
}
