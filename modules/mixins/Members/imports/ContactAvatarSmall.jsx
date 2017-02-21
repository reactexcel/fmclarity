/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

/**
 * @class 			ContactAvatarSmall
 * @memberOf	 	module:mixins/Members
 */
const ContactAvatarSmall = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {

		let contact = this.props.item,
			profile = this.props.item,
			name = profile?profile.name:"",
			url = null,
			style = {},
			initials = "";

		if ( contact ) {
			if ( contact.profile ) {
				profile = contact.profile;
				name = profile.name;
			}

			if ( contact.getThumbUrl ) {
				url = contact.getThumbUrl();
			}

			if ( url && url != "/img/default-placeholder.jpg" ) {
				style[ 'backgroundImage' ] = 'url(\'' + url + '\')';
				style[ 'backgroundSize' ] = "cover";
				style[ 'color' ] = "transparent";
			} else {
				let names = [];
				if ( name != null ) {
					names = name.trim().split( ' ' );
					if ( names.length == 1 ) {
						initials = names[ 0 ][ 0 ];
					}
					if ( names.length == 2 ) {
						initials = names[ 0 ][ 0 ] + names[ 1 ][ 0 ];
					} else if ( names.length == 3 ) {
						initials = names[ 0 ][ 0 ] + names[ 1 ][ 0 ] + names[ 2 ][ 0 ];
					} else if ( names.length > 3 ) {
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

	render() {
		return (
			<div className="contact-card-avatar">
				<div title={this.data.name} style={this.data.style}>{this.data.initials}</div>
			</div>
		)
	}
} )

export default ContactAvatarSmall;
