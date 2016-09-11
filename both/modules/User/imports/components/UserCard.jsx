import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import Menu from '/both/modules/MaterialNavigation';

UserCard = React.createClass( {

	getInitialState() {
		return {
			edit: this.props.edit || this.props.item == null || false
		}
	},

	toggleEdit() {
		this.setState( {
			edit: !this.state.edit
		} )
	},

	getMenu() {
		var component = this;
		var user = this.props.item;
		var team = this.props.team;
		var group = this.props.group;
		var menu = UserActions.getMenu( user, {
			team: team,
			facility: group
		} );
		if ( true /* user && user.canSave() */ ) {
			menu.unshift( {
				label: this.state.edit ? "View as card" : "Edit",
				action() {
					component.toggleEdit()
				}
			} );
		}
		return menu;
	},

	render() {

		var menu = this.getMenu();
		var user = this.props.item;
		return (
			<div>
				{(!user||user.canSave())&&this.state.edit?
					<UserViewEdit 
						item 		= { user } 
						team 		= { this.props.team }
						role 		= { this.props.role }
						group 		= { this.props.group }
						onChange 	= { this.props.onChange }/>
				:
					<UserViewDetail item={user} role={this.props.role}/>
				}
            	<Menu items={menu} />
			</div>
		)
	}
} );
