function addTeamMenuItem(menu,item,team) {
	if(
		team&&
		team.hasSupplier(item)&&
		team.canRemoveSupplier&&
		team.canRemoveSupplier()&&
		team._id!=item._id
	) {

		menu.push({
			label:"Remove supplier from "+team.getName(),
			shouldConfirm:true,
			action(){
				team.removeSupplier(item);
				Modal.hide();
			}
		});

	}
}

TeamCard = React.createClass({

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
		var item = this.props.item;
		var parentTeam = Session.getSelectedTeam();
		var parentFacility = Session.getSelectedFacility();
		var menu = [];

		if(item) {

			if(item.canSave()) {
				menu.push({
					label:this.state.edit?"View as card":"Edit",
					action(){
						component.toggleEdit()
					}
				});
			}

			addTeamMenuItem(menu,item,parentTeam);
			addTeamMenuItem(menu,item,parentFacility);

		}
		return menu;
	},

	render() {
		var menu = this.getMenu();
		var supplier = this.props.item;

		return (
			<div>
			    {(!supplier||supplier.canSave())&&this.state.edit?
			        <TeamViewEdit 
						item={supplier} 
						team={this.props.team}
						facility={this.props.facility}
						role={this.props.role}
						onChange={this.props.onChange}
			        />
			    :
					<TeamViewDetail item={supplier}/>
				}
            	<ActionsMenu items={menu} />
			</div>
		)
	}
});