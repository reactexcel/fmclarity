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
		var facility = this.props.item;
		var team = Session.getSelectedTeam();
		var menu = [];

		if(facility&&this.state.edit) {
			menu.push({
				label:("View as card"),
				action(){
					component.toggleEdit()
				}
			});
		}
		if(facility&&!this.state.edit&&facility.canSave(facility)) {
			menu.push({
				label:("Edit"),
				action(){
					component.toggleEdit()
				}
			});
		}
		if(facility.canDestroy()) {
			menu.push({
				label:"Delete Facility",
				action(){
					facility.destroy();
				}
			});
		}
		return menu;
	},

	render() {
		var menu = this.getMenu();
		var facility = this.props.item;
		var team = Session.getSelectedTeam();
		//console.log(this.props.item);
		return (
			<div>
			    {facility.canSave(facility)&&this.state.edit?
			        <FacilityViewEdit item={this.props.item} />
			    :
					<FacilityViewDetail item={this.props.item}/>
				}
            	<ActionsMenu items={menu} />
			</div>
		)
	}
});