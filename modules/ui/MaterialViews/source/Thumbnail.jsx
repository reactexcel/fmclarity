/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';

/**
 * @class 			Thumbnail
 * @memberOf 		module:ui/MaterialViews
 */
function Thumbnail( props ) {
	let style = _.extend( {
		backgroundImage: "url('" + props.item.thumbUrl + "')",
		backgroundSize: "cover"
	}, props.style )

	return (
		<div className="facility-thumbnail" style={style}>
			{ props.children }
		</div>
	)
}

export default Thumbnail;