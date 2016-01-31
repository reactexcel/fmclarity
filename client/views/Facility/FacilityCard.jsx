FacilityCard = React.createClass({

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
		var menu = [
			{
				label:(this.state.edit?"View as card":"Edit"),
				action(){
					component.toggleEdit()
				}
			}
		];
		if(selectedTeam._id!=item._id) {
			menu.push({
				label:"Delete Facility",
				action(){
					item.destroy()
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
			        <FacilityViewEdit item={this.props.item} />
			    :
					<FacilityViewDetail item={this.props.item}/>
				}
            	<ActionsMenu items={menu} />
			</div>
		)
	}
});