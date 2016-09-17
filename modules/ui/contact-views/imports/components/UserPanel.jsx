import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Menu } from '/both/modules/MaterialNavigation';

export default UserPanel = React.createClass( {

	render() {

		var contact, profile, availableServices;
		contact = this.props.item;

		if ( !contact ) {
			return <div/>
		}

		let roles = RolesMixin.getUserRoles( contact );
		console.log( roles );

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
						{this.props.role?<span>{this.props.role}<br/></span>:null}
						{profile.email?<span><b>Email</b> {profile.email}<br/></span>:null}
						{profile.phone||profile.phone2?<span><b>Phone</b> {profile.phone}<br/></span>:null}
						{profile.phone2?<span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> {profile.phone2}<br/></span>:null}
						<div style={{margin:"10px 0 10px 70px",borderBottom:"1px solid #ccc"}}>
						</div>
						{roles?
						roles.map( ( role, idx ) => {
							return <span key = { idx }><b style={ {textTransform:'uppercase'} }>{role.name}</b><span> at {role.context}</span><br/></span>
						})
						:null}

					</div>
			    </div>
			    {/*
            	<Menu items={menu} />
            	*/}
			</div>
		)
	}
} );
