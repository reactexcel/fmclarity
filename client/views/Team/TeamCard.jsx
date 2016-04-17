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
		var selectedTeam = Session.getSelectedTeam();
		var menu = [];
		
		if(item&&item.canSave()) {
			menu.push({
				label:this.state.edit?"View as card":"Edit",
				action(){
					component.toggleEdit()
				}
			});
		}

		if(selectedTeam._id!=item._id) {
			menu.push({
				label:"Remove supplier from your team",
				shouldConfirm:true,
				action(){
					selectedTeam.removeSupplier(item);
				}
			});
		}
		return menu;
	},

	render() {
		var menu = this.getMenu();
		var item = this.props.item;

		return (
			<div>
			    {item.canSave()&&this.state.edit?
			        <TeamViewEdit item={item} />
			    :
					<TeamViewDetail item={item}/>
				}
            	<ActionsMenu items={menu} />
			</div>
		)
	}
});