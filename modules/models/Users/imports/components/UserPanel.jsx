/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { Menu } from '/modules/ui/MaterialNavigation';
import { Roles } from '/modules/mixins/Roles';


/**
 * @class 			UserPanel
 * @membersOf 		module:models/Users
 */
class UserPanel extends React.Component {

	getMenu() {
		return [/* TeamActions.edit.bind( this.props.item ) */];
	}

	render() {

		var contact, profile, availableServices;
		contact = this.props.item;

		if ( !contact ) {
			return <div/>
		}

		let roles = Roles.getUserRoles( contact );
		//console.log( roles );

		if ( contact.getProfile ) {
			profile = contact.getProfile();
		}
		if ( contact.getAvailableServices ) {
			availableServices = contact.getAvailableServices();
		}

		return (
			<div className="business-card">				
				<div className="contact-thumbnail pull-left">
				    <img alt="image" src={contact.getThumbUrl()} />
				 </div>
				 <div className="contact-info">
				 	<div>
						<h2>{contact.getName()}</h2>

						{ this.props.role ? 
							<span>{this.props.role}<br/></span>
						: null }

						{ profile.email ?
							<span><b>Email</b> {profile.email}<br/></span>
						: null }

						{ profile.phone || profile.phone2 ? 
							<span><b>Phone</b> {profile.phone}<br/></span>
						: null }

						{ profile.phone2 ? 
							<span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> {profile.phone2}<br/></span>
						: null }

						<div style={{margin:"10px 0 10px 70px",borderBottom:"1px solid #ccc"}}></div>

						{ !roles ? null : roles.map( ( role, idx ) => {
							return (
								<span key = { idx }>
									<b style={ {textTransform:'uppercase'} }>{role.name}</b>
									<span> at {role.context}</span><br/>
								</span>
							)
						} ) }

					</div>
			    </div>
            	<Menu items = { this.getMenu() } />
			</div>
		)
	}
}

export default UserPanel;
