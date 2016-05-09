import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

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

		var menu = [];

		if(facility&&facility.canSave()) {
			menu.push({
				label:this.state.edit?"View as card":"Edit",
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
		var item = this.props.item;
		return (
			<div>
			    {item.canSave()&&this.state.edit?
			        <FacilityViewEdit item={item} />
			    :
					<FacilityViewDetail item={item}/>
				}
            	<ActionsMenu items={menu} />
			</div>
		)
	}
});