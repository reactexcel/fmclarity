import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

ContactAvatarSmall = React.createClass(
{

	mixins: [ ReactMeteorData ],

	getMeteorData()
	{
		Meteor.subscribe( 'File' );

		let contact = this.props.item,
			profile = this.props.item,
			name = profile.name,
			url = null,
			style = {},
			initials = "";

		if ( contact )
		{
			if ( contact.getProfile )
			{
				profile = contact.getProfile();
				name = profile.name;
			}

			if ( contact.getThumbUrl )
			{
				url = contact.getThumbUrl();
			}

			if ( url && url != "/img/default-placeholder.jpg" )
			{
				style[ 'backgroundImage' ] = 'url(\'' + url + '\')';
				style[ 'backgroundSize' ] = "cover";
				style[ 'color' ] = "transparent";
			}
			else
			{
				let names = [];
				if ( name != null )
				{
					names = name.trim().split( ' ' );
					if ( names.length == 1 )
					{
						initials = names[ 0 ][ 0 ];
					}
					if ( names.length == 2 )
					{
						initials = names[ 0 ][ 0 ] + names[ 1 ][ 0 ];
					}
					else if ( names.length == 3 )
					{
						initials = names[ 0 ][ 0 ] + names[ 1 ][ 0 ] + names[ 2 ][ 0 ];
					}
					else if ( names.length > 3 )
					{
						initials = names[ 0 ][ 0 ] + names[ 0 ][ 1 ] + names[ 0 ][ 2 ]
					}
					var r = ( name.charCodeAt( name.length - 3 ) % 25 ) * 10;
					var g = ( name.charCodeAt( name.length - 2 ) % 25 ) * 10;
					var b = ( name.charCodeAt( name.length - 1 ) % 25 ) * 10;
					style[ 'backgroundColor' ] = 'rgb(' + r + ',' + g + ',' + b + ')';
				}
			}

		}
		return {
			name,
			initials,
			style
		}
	},

	render()
	{
		return (
			<div className="contact-card-avatar">
				<div title={this.data.name} style={this.data.style}>{this.data.initials}</div>
			</div>
		)
	}
} );

Contact2Line = React.createClass(
{
	render()
	{
		let contact = this.props.item,
			profile = {},
			role = this.props.role,
			tenancy = "";

		if ( contact )
		{
			profile = contact.getProfile ? contact.getProfile() : contact;
			if ( profile )
			{
				tenancy = profile.tenancy;
			}
		}

		return (
			<span className="contact-card-2line-text">
				<span className="contact-card-line-1">{profile.name}</span>

				{
				tenancy?
				<span>&nbsp;<i className="fa fa-home"></i>&nbsp;{tenancy}</span>
				:null
				}

				{
				role?
				<span className="label label-default pull-right">{role}</span>
				:null
				}

				<br/>
		        <span className="contact-card-line-2">

		        {
		        profile.email?
		        <span><i className="fa fa-envelope"></i>&nbsp;{profile.email}</span>

		        :profile.phone?
		        <span>&nbsp;<i className="fa fa-phone"></i>&nbsp;{profile.phone}</span>

				:profile.phone2?
				<span>&nbsp;<i className="fa fa-phone"></i>&nbsp;{profile.phone2}</span>

		        :null
		        }

		        </span>
		    </span>
		)
	}
} );

//this is actually a contact tile
ContactCard = React.createClass(
{
	render()
	{

		let contact = this.props.item,
			profile = this.props.item,
			group = this.props.group,
			team = this.props.team,
			view = null,
			role = null;

		if ( contact.getProfile )
		{
			profile = contact.getProfile();
		}

		if ( group != null )
		{
			role = RBAC.getRole( contact, this.props.group );
		}
		else if ( this.props.team )
		{
			role = RBAC.getRole( contact, this.props.team );
		}

		return (
			<div className="contact-card contact-card-2line">
				<ContactAvatarSmall item={ contact } />
				<Contact2Line item={ contact } role={ role }/>
	        </div>
		)
	}
} );
