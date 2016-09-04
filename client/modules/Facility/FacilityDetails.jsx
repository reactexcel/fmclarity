import React from "react";
import AddressLink from './imports/AddressLink.jsx';

FacilityDetails = React.createClass(
{
	render()
	{
		let facility = this.props.item;

		if ( !facility )
		{
			return <div/>
		}

		return <div className="contact-info">
            <span className="contact-title">Site: {facility.name}<br/></span>
            <span><AddressLink item={facility.address}/><br/></span>
        </div>
	}
} )
