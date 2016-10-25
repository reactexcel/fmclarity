/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { Menu } from '/modules/ui/MaterialNavigation';
import { Roles } from '/modules/mixins/Roles';
import { UserActions } from '/modules/models/Users';
import { TeamActions } from '/modules/models/Teams';

/**
 * @class 			UserPanel
 * @membersOf 		module:models/Users
 */
class UserPanel extends React.Component {

	constructor( props ){
		super( props );
		this.state = {
			item : this.props.item,
		}
	}

	getMenu() {
		let user = this.props.item,
			group = this.props.group || Session.getSelectedTeam();
		let component = this;
		// callback when a user update his/her profile
		const onUpdate = ( newItem ) => {
			component.setState ( { item : newItem } );
		}
		return [
			UserActions.edit.bind( { user, group, onUpdate } ),
			UserActions.remove.bind( { user, group } ),
			TeamActions.inviteMember.bind( { user, group } ),
			UserActions.login.bind( user )
		];
	}

	componentWillReceiveProps( props ){
		this.setState( { item: props.item } );
	}

	render() {

		var contact, profile, availableServices;
		contact = this.state.item;

		if ( !contact ) {
			return <div/>
		}

		let roles = Roles.getUserRoles( contact );

		if ( contact.getProfile ) {
			profile = contact.getProfile();
		}
		if ( contact.getAvailableServices ) {
			availableServices = contact.getAvailableServices();
		}

		return (
			<div className="business-card">
				<div className="contact-thumbnail pull-left">
				    <img alt = "image" src = { contact.getThumbUrl() } />
				 </div>
				 <div className = "contact-info">
				 	<div>
						<h2>{ contact.getName() }</h2>

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
