import React from "react";
import AddressLink from './imports/AddressLink.jsx';

function FacilityDetails( props ) {
{
	if ( !props.item )
	{
		return <div/>
	}

	return (
		<div className="contact-info">
        	<span className="contact-title">Site: {props.item.name}<br/></span>
        	<span><AddressLink item={props.item.address}/><br/></span>
    	</div>
    )
}
