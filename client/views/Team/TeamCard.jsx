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
		var selectedTeam = FM.getSelectedTeam();
		var menu = [];
		if(item&&this.state.edit) {
			menu.push({
				label:"View as card",
				action(){
					component.toggleEdit()
				}
			});
		}
		if(item&&!this.state.edit&&item.canEdit()) {
			menu.push({
				label:"Edit",
				action(){
					component.toggleEdit()
				}
			});
		}
		if(selectedTeam._id!=item._id) {
			menu.push({
				label:"Remove supplier from your team",
				action(){
					selectedTeam.removeSupplier(item);
				}
			});
		}
		return menu;
	},

	render() {
		var menu = this.getMenu();
		//console.log(this.props.item);
		return (
			<div>
			    {this.state.edit?
			        <TeamViewEdit item={this.props.item} />
			    :
					<TeamViewDetail item={this.props.item}/>
				}
            	<ActionsMenu items={menu} />
			</div>
		)
	}
});