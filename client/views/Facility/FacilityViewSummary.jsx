import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FacilitySummary = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
		var facility,contact,contactProfile,thumb;
	    facility = this.props.item || {};
	    if(facility) {
	    	thumb = facility.getThumbUrl();
		    contact = facility.getPrimaryContact();
		    if(contact) {
		    	contactProfile = contact.getProfile();
		    }
		}
		return {
			facility:facility,
			thumb:thumb,
			contact:contactProfile
		}
    },

	render() {
		var facility = this.data.facility;
		var contact = this.data.contact;
		var thumb = this.data.thumb;
	    return (
	    	<div>
	    		{/*
				<div style={{marginTop:"10px",width:"25px",float:"left"}}>
					<input type="checkbox" />
				</div>*/

			//style['background'] = 'url(\''+url+'\')';
			//style['backgroundSize'] = "cover";

				}
				<div className="facility-thumbnail pull-left">
					<div style={{width:"37px",height:"37px",backgroundImage:"url('"+thumb+"')",backgroundSize:"cover"}}/>
				    {/*<img style={{width:"40px"}} alt="image" src={facility.getThumbUrl()} />*/}
				 </div>
				 <div className="facility-info contact-card contact-card-2line">
					<span className="contact-card-line-1">
						{facility.getName()}
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

});