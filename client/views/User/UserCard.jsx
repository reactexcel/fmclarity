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
		var selectedTeam = this.props.team||Session.getSelectedTeam();
		var menu = [];

		if(user&&user.canSave()) {
			menu.push({
				label:this.state.edit?"View as card":"Edit",
				action(){
					component.toggleEdit()
				}
			});
		}

		if(selectedTeam&&selectedTeam.hasMember(user)&&!user.isLoggedIn()) {
			menu.push({
				label:"Remove from "+selectedTeam.getName(),
				shouldConfirm:true,
				action(){
					selectedTeam.removeMember(user);
					//Modal.hide();
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
						role={this.props.role}
						onChange={this.props.onChange}
					/>
				:
					<ContactSummary item={user}/>
				}
            	<ActionsMenu items={menu} />
			</div>
		)
	}
});