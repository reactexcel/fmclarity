/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { Menu } from '/modules/ui/MaterialNavigation';
import { Roles } from '/modules/mixins/Roles';
import { Actions } from '/modules/core/Actions';
import { UserActions } from '/modules/models/Users';
import { MemberActions } from '/modules/mixins/Members';
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

		const onUpdate = ( newItem ) => {
			this.setState ( { item : newItem } );
		}
		
		let user = this.props.item,
			group = this.props.group || Session.getSelectedTeam(),
			menuItems = [];
		let actionNames = Object.keys( UserPanelActions.actions ),
			validActions = Actions.filter( actionNames, group );

		for( actionName in validActions ) {
			let action = validActions[ actionName ];
			menuItems.push( action.bind( group, user, onUpdate ) );
		}

		return menuItems;

		/*
		return [
			MemberActions.edit.bind( group, user, onUpdate ),
			MemberActions.remove.bind( group, user ),
			MemberActions.invite.bind( group, user ),
			//TeamActions.inviteMember.bind( { user, group } ),
			UserActions.login.bind( user )
		];
		*/
	}

	componentWillReceiveProps( props ){
		this.setState( { item: props.item } );
	}

	render() {

		let profile = null,
			availableServices = null,
			contact = this.state.item,
			thumbUrl = null,
			hideMenu = this.props.hideMenu;

		if ( !contact ) {
			return <div/>
		}

		if( contact.getThumbUrl ) {
			thumbUrl = contact.getThumbUrl();
		}

		let roles = Roles.getUserRoles( contact );

		if ( contact.getProfile ) {
			profile = contact.getProfile();
		}
		if ( contact.getAvailableServices ) {
			availableServices = contact.getAvailableServices();
		}

		let relation =this.props.group? this.props.group.getMemberRelation( contact ) : Session.getSelectedTeam().getMemberRelation( contact );
		return (
			<div className="business-card">
				<div className="contact-thumbnail pull-left">
				    <img alt = "image" src = { thumbUrl } />
				 </div>
				 <div className = "contact-info">
				 	<div>
						<h2>{ contact.getName() }</h2>
						{ relation&&relation.role ?
							<span>{ relation.role }<br/></span>
						: null }

						{( _.contains(['fmc support', 'portfolio manager'], Meteor.user().getRole()) && relation && relation.threshold) ? 
							<span><b>WO Issue Threshold</b> {relation.threshold}<br/></span>
							 : null}

						{ profile.email ?
							<span><b>Email</b> {profile.email}<br/></span>
						: null }

						{ profile.phone || profile.phone2 ?
							<span><b>Phone</b> {profile.phone}<br/></span>
						: null }

						{ profile.phone2 ?
							<span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> {profile.phone2}<br/></span>
						: null }

						<div style = { {margin:"10px 0 10px 70px",borderBottom:"1px solid #ccc"} }></div>

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
			    { !hideMenu ?
            		<Menu items = { this.getMenu() } />
            	: null }
			</div>
		)
	}
}

export default UserPanel;
