import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

export default function FacilityListTile( props )
{
	let { item, notification } = props;
		contact = null;

	if( item==null )
	{
		return <div/>
	}

	if( item.contact != null)
	{
		contact = item.contact.profile;
	}

	return (
		<div>

			<div className="facility-thumbnail pull-left">
				<div style={{width:"37px",height:"37px",backgroundImage:"url('"+item.thumbUrl+"')",backgroundSize:"cover"}}/>

				{notification?
				<div style={{position:"absolute",bottom:"0px",right:"0px"}}>
					<span className="label label-notification">{notification}</span>
				</div>:null}

			    {/*<img style={{width:"40px"}} alt="image" src={facility.getThumbUrl()} />*/}
			 </div>

			 <div className="facility-info contact-card contact-card-2line">

				<span className="contact-card-line-1">
					{item.name}
				</span>
				<br/>

				{contact?
				<span className="contact-card-line-2">
          			<a href="#">{contact.name}</a>&nbsp;&nbsp;
	            	{contact.email?
	            	<span><i className="fa fa-envelope"></i>&nbsp;{contact.email}</span>
	            	:null}		            	
        		</span>					
				:null}

		    </div>

		</div>
	)
}





