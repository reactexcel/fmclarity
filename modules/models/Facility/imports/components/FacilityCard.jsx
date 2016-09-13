import React from 'react';
import { Thumbnail } from '/both/modules/MaterialViews';

export default function FacilityCard( props ) {
	var facility = props.item;
	if ( !facility ) {
		return <div/>
	}

	return (

	<div className="facility-card2" onClick={ (e) => { props.onClick ? props.onClick( e ) : null }}>
		<Thumbnail item = { facility }>
			<div className="thumbnail-overlay">
		    	<h3 className="title-line">{ facility.name }</h3>
		    	<span className="address-line"><i className="fa fa-map-marker"></i> { facility.getAddress() }</span>
			</div>
		</Thumbnail>
	</div>

	)
}
