import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

//To be renamed Facility Tile
FacilitySummary = React.createClass(
{

	mixins: [ ReactMeteorData ],

	getMeteorData()
	{
		var facility, contact, contactProfile, thumb;
		facility = this.props.item ||
		{};
		if ( facility && facility.getThumbUrl )
		{
			thumb = facility.getThumbUrl();
			contact = facility.getPrimaryContact();
			if ( contact )
			{
				contactProfile = contact.getProfile();
			}
		}
		return {
			facility: facility,
			thumb: thumb,
			contact: contactProfile
		}
	},

	render()
	{
		var facility = this.data.facility;
		var contact = this.data.contact ||
		{};
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
					{this.props.notification?
					<div style={{position:"absolute",bottom:"0px",right:"0px"}}>
						<span className="label label-notification">{this.props.notification}</span>
					</div>:null}

				    {/*<img style={{width:"40px"}} alt="image" src={facility.getThumbUrl()} />*/}
				 </div>
				 <div className="facility-info contact-card contact-card-2line">
					<span className="contact-card-line-1">
						{facility.name}
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

} );

FacilityThumbnail = React.createClass(
{
	mixins: [ ReactMeteorData ],
	getMeteorData()
	{
		return {
			thumb: this.props.item.getThumbUrl()
		}
	},
	render()
	{
		var style = _.extend(
		{
			//width:"37px",
			//height:"37px",
			backgroundImage: "url('" + this.data.thumb + "')",
			backgroundSize: "cover"
		}, this.props.style )
		return <div className="facility-thumbnail" style={style}>
			{this.props.children}
		</div>
	}
} )

FacilityContact = React.createClass(
{
	mixins: [ ReactMeteorData ],
	getMeteorData()
	{
		var contact = this.props.item.getPrimaryContact();
		if ( contact && contact.getProfile )
		{
			contact = contact.getProfile();
		}
		return {
			contact
		}
	},
	render()
	{

		if ( !this.data.contact ) return <div/>

		return <span className="contact-card-line-2">
  			<a href="#">{this.data.contact.name}</a>&nbsp;&nbsp;
        	{this.data.contact.email?
        		<span><i className="fa fa-envelope"></i>&nbsp;{this.data.contact.email}</span>
        	:null}		            	
		</span>
	}
} )

//To be renamed FacilityCard
FacilityCard2 = React.createClass(
{

	render()
	{

		var facility = this.props.item;
		if ( !facility ) return <div/>

		var address = facility.getAddress();

		return <div className="facility-card2" onClick={(e)=>{this.props.onClick?this.props.onClick(e):null}}>
    		<FacilityThumbnail item={facility}>
    			<div className="thumbnail-overlay">
			    	<h3 className="title-line">{facility.name}</h3>
			    	<span className="address-line"><i className="fa fa-map-marker"></i> {address}</span>
    			</div>
    		</FacilityThumbnail>
    		{/*<FacilityContact item={facility}/>*/}
		</div>
	}

} );
