import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


ContactViewName = React.createClass({
	render() {
		var contact = this.props.item || {};
		var name;
		if(_.isString(contact)) {
			name = contact;
		}
		else {
			name = contact.getName?contact.getName():contact.name;
		}

		return (
			<span>{name}</span>
		)
	}
})

ContactAvatarSmall = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		Meteor.subscribe('File');
		var contact, profile, name, url, style = {}, initials='';

		contact = this.props.item;
		if(contact) {
			profile = contact.getProfile();
		}
		name = profile?profile.name:"";
		url = contact?contact.getThumbUrl():"";
		if(url&&url!="/img/default-placeholder.jpg") {
			style['backgroundImage'] = 'url(\''+url+'\')';
			style['backgroundSize'] = "cover";
			style['color'] = "transparent";
		}
		else {
			var names = name.trim().split(' ');
			if(names.length==2) {
				initials = names[0][0]+names[1][0];
			}
			else if(names.length==3) {
				initials = names[0][0]+names[1][0]+names[2][0];
			}
			else {
				initials = names[0][0]+names[0][1]+names[0][2]
			}
			var r = (name.charCodeAt(name.length-3)%25)*10;
			var g = (name.charCodeAt(name.length-2)%25)*10;
			var b = (name.charCodeAt(name.length-1)%25)*10;
			style['backgroundColor'] = 'rgb('+r+','+g+','+b+')';
		}
		return {
			name:name,
			initials:initials,
			style:style
		}
	},

	render() {
		return (
			<div className="contact-card-avatar">
				<div title={this.data.name} style={this.data.style}>{this.data.initials}</div>
			</div>
		)
	}
});

Contact2Line = React.createClass({
	render() {
		var contact, profile, role, tenancy;
		contact = this.props.item;
		role = this.props.role;
		if(contact) {
			profile = contact.getProfile();
		}
		if(!profile) {
			return <div />
		}
		tenancy = profile.tenancy;
		return (
			<span className="contact-card-2line-text">
				<span className="contact-card-line-1">{profile.name}</span>
				{tenancy?<span>&nbsp;<i className="fa fa-home"></i>&nbsp;{tenancy}</span>:null}
				{role?<span className="label label-default pull-right">{role}</span>:null}<br/>
		        <span className="contact-card-line-2">

		            {profile.email?
		            	<span><i className="fa fa-envelope"></i>&nbsp;{profile.email}</span>
		            	:profile.phone?<span>&nbsp;<i className="fa fa-phone"></i>&nbsp;{profile.phone}</span>
						:profile.phone2?<span>&nbsp;<i className="fa fa-phone"></i>&nbsp;{profile.phone2}</span>
		            	:null
		            }
		        </span>
		    </span>
		)
	}
});

Contact2LineWithAvatar = React.createClass({
	render() {
		var contact = this.props.item;
		var role = this.props.role;
		return (
			<div className="contact-card contact-card-2line">
				<ContactAvatarSmall item={contact} />
				<Contact2Line item={contact} role={role}/>
	        </div>
		)
	}
});

Contact1Line = React.createClass({
	render() {
		var contact, profile;
		contact = this.props.item;
		if(contact) {
			profile = contact.getProfile?contact.getProfile():contact;
		}
		if(!profile) {
			return <div />
		}
		return (
            <span className="contact-card contact-card-1line">
              <a href="#">{profile.name}</a>&nbsp;&nbsp;
              <span className="hidden-xs">

		            	{profile.email?
		            		<span><i className="fa fa-envelope"></i>&nbsp;{profile.email}</span>
		            	:null}
		            	{profile.phone?<span>&nbsp;<i className="fa fa-phone"></i>&nbsp;{profile.phone}</span>:null}
		            	{profile.phone2?<span>&nbsp;<i className="fa fa-phone"></i>&nbsp;{profile.phone2}</span>:null}
		            	
              </span>
            </span>
		)
	}
});

Contact3Line = React.createClass({
	render() {
		var contact, profile;
		contact = this.props.item;
		if(contact) {
			profile = contact.getProfile();
		}
		if(!profile) {
			return <div />
		}
		return (
            <div className="contact-card contact-card-1line">
            	<div style={{color:"#000"}}>{profile.name}</div>
              	<div style={{color:"#777"}}>

		            	{profile.email?
		            		<span><i className="fa fa-envelope"></i>&nbsp;{profile.email}</span>
		            	:null}
		            	{profile.phone?<span>&nbsp;<i className="fa fa-phone"></i>&nbsp;{profile.phone}</span>:null}
		            	{profile.phone2?<span>&nbsp;<i className="fa fa-phone"></i>&nbsp;{profile.phone2}</span>:null}

            	</div>
            </div>
		)
	}
});

ContactCard = React.createClass({
	render() {
		
		var contact,profile,view;
		contact = this.props.item;

		if(contact&&contact.getProfile) {
			profile = contact.getProfile();
		}
		else {
			console.log({
				'no getProfile function for':contact
			});
			profile = {};
		}

		var role;
		if(this.props.team) {
			role = RBAC.getRole(contact,this.props.team);
		}
		else if(this.props.facility) {
			role = RBAC.getRole(contact,this.props.facility);
		}

		view = this.props.view;
		switch(view) {
			case 'avatar':return (
				<ContactAvatarSmall item={contact} role={role}/>
			);
			case '1-line':return (
				<Contact1Line item={contact} role={role}/>
			);
			default:return (
				<Contact2LineWithAvatar item={contact} role={role}/>
	        );
		}
	}
});