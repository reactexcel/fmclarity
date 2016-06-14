import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

UserCard = React.createClass({

	getInitialState() {
		return {
			edit:this.props.edit||this.props.item==null||false
		}
	},

	toggleEdit() {
		this.setState({
			edit:!this.state.edit
		})
	},

	getMenu() {
		var component = this;
		var user = this.props.item;
		var selectedTeam = this.props.team;
		var selectedFacility = this.props.facility;
		var menu = UserActions.getMenu(user,{team:selectedTeam,facility:selectedFacility});
		if(user&&user.canSave()) {
			menu.unshift({
				label:this.state.edit?"View as card":"Edit",
				action(){
					component.toggleEdit()
				}
			});
		}
		return menu;
	},

	render() {
		var menu = this.getMenu();
		var user = this.props.item;
		return (
			<div>
				{(!user||user.canSave())&&this.state.edit?
					<UserProfile 
						item={user} 
						team={this.props.team}
						facility={this.props.facility}
						group={this.props.group}
						onChange={this.props.onChange}/>
				:
					<ContactSummary item={user} role={this.props.role}/>
				}
            	<ActionsMenu items={menu} />
			</div>
		)
	}
});