import React from 'react';

export default function AddressLink( props ) {
	let addressString = makeAddressString( props.item ),
		style = {
			color: '#000',
			cursor: 'pointer'
		};

	return (
		<span style={style} onClick={()=>{ openMap(addressString) }}>
  			<i className="fa fa-map-marker"></i> 
  			{addressString}
  		</span>
	)


	function makeAddressString( a ) {
		var str = '';
		if ( a ) {
			str =
				( a.streetNumber ? a.streetNumber : '' ) +
				( a.streetName ? ( ' ' + a.streetName ) : '' ) +
				( a.streetType ? ( ' ' + a.streetType ) : '' ) +
				( a.city ? ( ', ' + a.city ) : '' );
		}
		str = str.trim();
		return str.length ? str : '';
	}

	function openMap( addressString ) {
		let url = `http://maps.google.com.au/?q=${addressString}`;
		window.open( url, 'window', 'toolbar=no, menubar=no, location=no, resizable=yes' );
	}
}
