import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

ContactAvatarSmall = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		Meteor.subscribe('File');
		var contact, profile, name, url, style = {}, initials='';

		contact = this.props.item;
		if(contact) {
			if(contact.getProfile) {
				profile = contact.getProfile();
				name = profile?profile.name:"";
			}
			if(contact.getThumbUrl) {
				url = contact?contact.getThumbUrl():"";
				if(url&&url!="/img/default-placeholder.jpg") {
					style['backgroundImage'] = 'url(\''+url+'\')';
					style['backgroundSize'] = "cover";
					style['color'] = "transparent";
				}
				else {
					var names;
					if(name) {
						names = name.trim().split(' ');
						if(names.length==1) {
							initials = names[0][0];
						}
						if(names.length==2) {
							initials = names[0][0]+names[1][0];
						}
						else if(names.length==3) {
							initials = names[0][0]+names[1][0]+names[2][0];
						}
						else if(names.length>3) {
							initials = names[0][0]+names[0][1]+names[0][2]
						}
						var r = (name.charCodeAt(name.length-3)%25)*10;
						var g = (name.charCodeAt(name.length-2)%25)*10;
						var b = (name.charCodeAt(name.length-1)%25)*10;
						style['backgroundColor'] = 'rgb('+r+','+g+','+b+')';
					}
				}
			}
		}
		return {
			name:name,
			initials:initials||'...',
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
		if(contact&&contact.getProfile) {
			profile = contact.getProfile();
			tenancy = profile.tenancy;
			role = this.props.role;
		}
		else {
			return <div />
		}
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
		else if(this.props.group) {
			role = RBAC.getRole(contact,this.props.group);
		}

		return (
			<div className="contact-card contact-card-2line">
				<ContactAvatarSmall item={contact} />
				<Contact2Line item={contact} role={role}/>
	        </div>
		)
	}
});