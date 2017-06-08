/**
 * @class 			Thumbnail
 * @memberOf 		module:ui/MaterialViews
 */
import React from "react";

let css = {
    'facility-list-tile': {
        overflow: 'hidden',
        padding:'3px'
    }
}

/**
 * @class 			FacilityListTile
 * @memberOf 		module:models/Facilities
 */
function FacilityListTile( props ) {
    let { item, notification } = props,
    	contact = null,
    	thumbUrl = '';

    if ( item == null ) {
        return <div/>
    }

    if ( !item.getThumbUrl ) {
    	import { Facilities } from '/modules/models/Facilities';
    	item = Facilities.collection._transform( item );
    }

    thumbUrl = item.getThumbUrl();

    if ( item.contact != null ) {
        contact = item.contact.profile;
    }

    return (
        <div style={css['facility-list-tile']} className="facility-list-tile">

			<div className="facility-thumbnail pull-left">
				<div style={{width:"37px",height:"37px",backgroundImage:"url('"+thumbUrl+"')",backgroundSize:"cover"}}/>

				{ notification ?

				<div style={{position:"absolute",bottom:"0px",right:"0px"}}>
					<span className="label label-notification">{ notification }</span>
				</div>

				: null }

			    {/*<img style={{width:"40px"}} alt="image" src={facility.getThumbUrl()} />*/}
			 </div>

			 <div className="facility-info contact-card contact-card-2line">

				<span className="contact-card-line-1">
					{ item.name }
				</span>
				<br/>

				{ contact ?

				<span className="contact-card-line-2">
          			<a href="#">{ contact.name }</a>&nbsp;&nbsp;

	            	{ contact.email ?
	            	<span><i className="fa fa-envelope"></i>&nbsp;{ contact.email }</span>
	            	: null }

        		</span>

				: null }

		    </div>

		</div>
    )
}

export default FacilityListTile;
