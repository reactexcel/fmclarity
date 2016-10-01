/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';

import { FacilityThumbnail } from '/modules/models/Facilities';

export default function FacilityCard( props ) {
	var facility = props.item;
	if ( !facility ) {
		return <div/>
	}

	return (

	<div className="facility-card2" onClick={ (e) => { props.onClick ? props.onClick( e ) : null }}>
		<FacilityThumbnail item = { facility }>
			<div className="thumbnail-overlay">
		    	<h3 className="title-line">{ facility.name }</h3>
		    	<span className="address-line"><i className="fa fa-map-marker"></i> { facility.address.toString() }</span>
			</div>
		</FacilityThumbnail>
	</div>

	)
}