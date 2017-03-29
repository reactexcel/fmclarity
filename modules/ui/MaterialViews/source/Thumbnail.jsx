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
//	console.log( props );

	let { item } = props,
		thumbUrl = null,
		style = props.style || {};

	if( item.getThumbUrl ) {
		thumbUrl = item.getThumbUrl();
		style['backgroundImage'] = "url('" + thumbUrl + "')";
		style['backgroundSize'] = "cover";
	}

	return (
		<div className="facility-thumbnail" style = { style }>
			{ props.children }
		</div>
	)
}

export default Thumbnail;
