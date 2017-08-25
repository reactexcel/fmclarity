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
import { TeamActions,Teams } from '/modules/models/Teams';
import { Users } from '/modules/models/Users';
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

	getMenu(role) {
		const onUpdate = ( newItem ) => {
			this.setState ( { item : newItem } );
		}
        let logedInUser = Meteor.user();
		let user = this.props.item,
			group = this.props.group || Session.getSelectedTeam(),
			menuItems = [];
		let actionNames = Object.keys( UserPanelActions.actions ),
			validActions = Actions.filter( actionNames, group );
		for( actionName in validActions ) {
			let action = validActions[ actionName ];
			let shouldConfirm = actionName == 'login as user' && logedInUser.getRole() == "fmc support" ? true : false;
			let a = action.bind( {shouldConfirm:shouldConfirm}, group,  user, onUpdate  )
			if(actionName == 'login as user'){
				a.uniqueAlertLabel = "Login as "+user.profile.name+' ?'
			}
			menuItems.push( a );
			/*if( _.isEmpty(a.uniqueAlertLabel)){
				menuItems.push( a );
			}else{
				if(_.contains(['fmc support'],logedInUser.getRole())){
					menuItems.push( a );
				}
			}*/
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

	getRoleInCurrentTeam(roles){
		let teamOwner = Teams.findOne({_id:this.props.group._id})
		let userRole;
		if(!_.isEmpty(teamOwner)){
			roles.map( ( role, idx ) => {
				if(role.context == teamOwner.name){
					userRole = role.name;
				}
			} )
		}
		return userRole;
	}

	render() {
		let profile = null,
			availableServices = null,
			contact = this.state.item,
			thumbUrl = null,
			userRole = Meteor.user().getRole(),
			//hideMenu = this.props.hideMenu;
            hideMenu = !_.contains(['fmc support','portfolio manager'],userRole)
			console.log(Meteor.user().getRole(),"user role");
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
		let roleInCurrentTeam = this.props.group ? this.getRoleInCurrentTeam(roles) : null;
		let relation =this.props.group? this.props.group.getMemberRelation( contact ) : Session.getSelectedTeam().getMemberRelation( contact );
		roleInCurrentTeam = !_.isEmpty(roleInCurrentTeam) ? roleInCurrentTeam : (relation && relation.role ? relation.role : null)

		return (
			<div className="business-card">
				<div className="contact-thumbnail pull-left">
				    <img alt = "image" src = { thumbUrl } />
				 </div>
				 <div className = "contact-info">
				 	<div>
						<h2>{ contact.getName() }</h2>
						{ roleInCurrentTeam ?
							<span>{ roleInCurrentTeam }<br/></span>
						: null }

						{/*{( _.contains(['fmc support', 'portfolio manager'], Meteor.user().getRole()) && relation && relation.threshold) ?
													<span><b>WO Issue Threshold</b> {relation.threshold}<br/></span>
													 : null}*/}

						{( _.contains(['fmc support', 'portfolio manager'], Meteor.user().getRole()) && relation && relation.issueThresholdValue && 
							/*temp fix to hide for old non-manager users who have threshold value(that should not be existing) still set on their profile. this should later be removed--*/ 
							_.contains(['manager', 'caretaker'], relation.role)) ? 

							<span><b>WO Issue Threshold Value</b> {relation.issueThresholdValue}<br/></span>
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
            		<Menu items = { this.getMenu(relation&&relation.role ? relation.role : null) } />
            	: null }
			</div>
		)
	}
}

export default UserPanel;
