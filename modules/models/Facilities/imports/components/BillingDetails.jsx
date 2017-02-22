import React from "react";

export default function BillingDetails( props ) {
	if ( !props.item ) {
		return <div/>
	}
	var billingDetails = props.item.billingDetails;
	var teamType = Session.get('selectedTeam').type;

	return (
		<div className="contact-info">

        	{teamType=='contractor' && billingDetails ?
        	<div>
        	<span className="contact-title">Billing Address<br/></span>
        	        	<ul>
        	        	{billingDetails.company ? <li> {billingDetails.company}</li> : null}
        	        	{billingDetails.address_1 ? <li> {billingDetails.address_1}</li> : null}
        	        	{billingDetails.address_2 ? <li> {billingDetails.address_2}</li> : null}
        	        	{billingDetails.suburb ? <li> {billingDetails.suburb}</li> : null}
        	        	{billingDetails.state ? <li> {billingDetails.state}{billingDetails.postcode ? <span>, {billingDetails.postcode}</span> : null}</li> : null}
        	
        	        	</ul>
        	</div>
        	:null}
        	
    	</div>
	)
}
