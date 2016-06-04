import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FacilitySummary = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
		var facility,contact,contactProfile;
	    facility = this.props.item || {};
	    if(facility) {
		    contact = facility.getPrimaryContact();
		    if(contact) {
		    	contactProfile = contact.getProfile();
		    }
		}
		return {
			facility:facility,
			contact:contactProfile
		}
    },

	render() {
		var facility = this.data.facility;
		var contact = this.data.contact;
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
					<div style={{width:"37px",height:"37px",backgroundImage:"url('"+facility.getThumbUrl()+"')",backgroundSize:"cover"}}/>
				    {/*<img style={{width:"40px"}} alt="image" src={facility.getThumbUrl()} />*/}
				 </div>
				 <div className="facility-info">
					<span>
						{facility.getName()}
					</span>
					<br/>
					{contact?
					<span style={{fontSize:"11px",color:"#aaa"}}>
						<span className="contact-card contact-card-1line">
              				<a href="#">{contact.name}</a>&nbsp;&nbsp;
		            		{contact.email?
		            			<span><i className="fa fa-envelope"></i>&nbsp;{contact.email}</span>
		            		:null}		            	
            			</span>					
					{/*}	<Contact1Line item={contact}/>*/}
					</span>
					:null}
			    </div>
			</div>
		)
	}

});