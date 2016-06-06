import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

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

	getMenu() {
		var component = this;
		var supplier = this.props.item;
		var parentTeam = Session.getSelectedTeam();
		var parentFacility = Session.getSelectedFacility();
		var menu = [];

		if(supplier) {

			if(supplier.canSave()) {
				menu.push({
					label:"Edit",
					action(){
						Modal.show({
							content:<TeamViewEdit 
								item={supplier} 
								team={component.props.team}
								facility={component.props.facility}
								role={component.props.role}
								onChange={component.props.onChange}
					        />
						})
					}
				});
			}

			addTeamMenuItem(menu,supplier,parentTeam);
			addTeamMenuItem(menu,supplier,parentFacility);

		}
		return menu;
	},

	render() {
		var menu = this.getMenu();
		var supplier = this.props.item;

		return (
			<div>
				<TeamViewDetail item={supplier}/>
	            <ActionsMenu items={menu} />
	        </div>
		)
	}
});