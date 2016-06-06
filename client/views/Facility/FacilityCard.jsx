import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

/* This now redundant and to be moved into FacilityViewDetail */

FacilityCard = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
		return {
			facility:this.props.item
		}
	},

	getMenu() {
		var component = this;
		var facility = this.data.facility;
		var menu = [];

		if(facility&&facility.canSave()) {
			menu.push({
				label:"Edit",
				action(){
					Modal.show({
						content:<FacilityViewEdit item={facility} />
					})
				}
			});
		}

		if(facility.canDestroy()) {
			menu.push({
				label:"Delete",
				action(){
					facility.destroy();
				}
			});
		}
		return menu;
	},

	render() {
		var menu = this.getMenu();
		var facility = this.data.facility;
		return (
			<div>
				<FacilityViewDetail item={facility}/>
            	<ActionsMenu items={menu} />
			</div>
		)
	}
});