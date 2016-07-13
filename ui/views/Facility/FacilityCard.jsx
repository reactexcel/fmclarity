import React from 'react';

import { ReactMeteorData } from 'meteor/react-meteor-data';
import ActionsMenu from 'meteor/fmc:actions-menu';

/*
//Placeholder for the more idiomatic
FacilityCard = createContainer(({item})=>{
	console.log(item);
	return {
		facility:item
	}
},FacilityCardInner);
*/

FacilityCard = React.createClass({
	mixins:[ReactMeteorData],
	getMeteorData(){
		return {
			facility:this.props.item
		}
	},
	render() {
		return <FacilityCardInner item={this.data.facility}/>
	}
})

class FacilityCardInner extends React.Component {

	getMenu() {
		var facility = this.props.item;
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
	}

	render() {
		return (
			<div>
				<FacilityViewDetail item={this.props.item}/>
            	<ActionsMenu items={this.getMenu()} />
			</div>
		)
	}
}