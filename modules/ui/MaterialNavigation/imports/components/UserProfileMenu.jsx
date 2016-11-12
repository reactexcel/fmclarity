/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { ContactCard } from '/modules/mixins/Members';
import { Actions, Routes } from '/modules/core/Actions';

/**
 * @class           UserProfileMenu
 * @memberOf        module:models/User
 */
function UserProfileMenu( { user, team, teams, children, UserActions } ) {

	function selectTeam( user, team ) {
		//console.log( user );
		user.selectTeam( team );
	}

	if ( !team ) {
		return ( <div style = {
				{
					background: "rgba(0,0,0,0.5)",
					position: "fixed",
					zIndex: 5000,
					left: "0px",
					right: "0px",
					top: "0px",
					bottom: "0px",
					textAlign: "center"
				}
			} >
			<div style = {
				{
					position: "absolute",
					width: "100px",
					marginLeft: "-50px",
					left: "50%",
					top: "50%",
					marginTop: "-50px"
				}
			} >
			<RefreshIndicator
					size = { 100 }
					left = { 0 }
					top = { 0 }
					status = "loading"
			/> 
			</div>
			</div>
		)
	}

	let actionNames = Object.keys( UserMenuActions.actions ),
		validActions = Actions.filter( actionNames, team ),
		validActionNames = Object.keys( validActions );

	let userEmail = user && user.emails ? user.emails[ 0 ].address : '',
		userThumb = user ? user.thumbUrl : '';

	return (
		<div id="settings-icon" className="dropdown right-dropdown">
			<span className="dropdown-toggle count-info" data-toggle="dropdown">
				{ children }
			</span>
			<ul id="settings-menu" className="fm-layout-menu user-profile-menu dropdown-menu dropdown-alerts">
				<li>
					<a style = { { padding:"7px 8px", height:"48px" } } onClick = { () => { Actions.run( 'edit user', { user } ) } }>
						<ContactCard item = { user }/>
					</a>
				</li>
				{ teams && teams.length ? <li className="divider"></li>:null}
				{ teams && teams.length ? teams.map( ( t ) => {
					return (
						<li
							key         = { t._id }
							className   = { ( team && t && team._id == t._id )?"active":''}
							onClick     = { () => { selectTeam( user, t ) } }
						>

							<a style={{padding:"7px 0px 6px 7px"}}>
								<ContactCard item = { t }/>
							</a>
						</li>
					)
				} ) : null }
				<li className="divider"></li>

				{/*******************************************/

				validActionNames.map( ( actionName ) => { 

					let action 		= UserMenuActions.actions[ actionName ],
						icon        = action.icon,
						label       = action.label;

					return (
						<li key = { actionName }>
							<a onClick = { () => { action.run( team ) } } >
								<i className = { icon }></i>&nbsp;&nbsp;
								<span>{ label }</span>
							</a>
						</li>
					)

				})/*******************************************/}


				<li>
					<a style={{padding:0,textAlign:"right",fontSize:"8px",paddingRight:"15px"}} target="_blank" href="https://bitbucket.org/mrleokeith/fm-clarity/src/develop/CHANGELOG.md">v{FM.version}</a>
				</li>
			</ul>
		</div>
	)
}

export default UserProfileMenu;
