/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
 
import React from "react";

/**
 * An ui component that renders a tile indicating multiple items
 * The component looks at the thumnNails of the items provided and, if available, renders a gallery icons using them.
 * @class 			NavListTileMultiple
 * @memberOf 		module:ui/MaterialNavigation
 * @param 			{array} items - An array of items to use in generating the icon
 */
function NavListTileMultiple( props )
{
	var items = props.items;
	var images = [];
	if ( items && items.length )
	{
		for ( var i = 0; i < 3; i++ )
		{
			if ( items[ i ] )
			{
				images.push( items[ i ].thumbUrl );
			}
		}
	}
	return (
		<div>

			<div className="avatar" style={{position:"relative",float:"left"}}>

				{ images.map( (src,idx) => {
					return <img key={idx+'-'+src} src={src} style={{width:"27px",height:"27px",border:"1px solid #bbb",position:"absolute",top:(idx*5)+"px",left:(idx*5)+"px"}} />
				} ) }

				{ items && items.length ?
					<div style={{position:"absolute",top:"15px",left:"25px"}}>
						<span className="label label-notification">{items.length}</span>
					</div>
				: null }

			</div>

			<div style={{float:"left",paddingLeft:"42px"}}>All Facilities</div>

		</div>
	)
}

export default NavListTileMultiple;