import React from 'react';

function FacilityThumbnail( props )
{
	let style = _.extend(
	{
		backgroundImage: "url('" + props.item.thumbUrl + "')",
		backgroundSize: "cover"
	}, props.style )



	return (
		<div className="facility-thumbnail" style={style}>
			{props.children}
		</div>
	)
}