import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

import ActionsMenu from 'meteor/fmc:actions-menu';

function addTeamMenuItem(menu,item,team) {
	if(team) {
		if(team.hasSupplier(item)&&team.canRemoveSupplier&&team.canRemoveSupplier()&&team._id!=item._id) {

			menu.push({
				label:"Remove supplier from "+team.getName(),
				shouldConfirm:true,
				action(){
					team.removeSupplier(item);
					Modal.hide();
				}
			});

		}

		if(item&&item.ownerIs&&item.ownerIs(team)) {
			var itemName = item.getName();
			menu.push({
				label:"Revoke ownership of "+itemName,
				shouldConfirm:true,
				action() {
					item.clearOwner();
				}
			})
		}
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
								group={component.props.group}
								onChange={component.props.onChange}/>
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
		var component = this;

		if(!supplier) {
			return (
				<div>			
					<TeamViewEdit 
						item={supplier} 
						team={component.props.team}
						facility={component.props.facility}
						group={component.props.group}
						onChange={component.props.onChange}/>
				</div>
			)
		}

		return (
			<div>			
				<TeamViewDetail item={supplier}/>
	            <ActionsMenu items={menu} />
	        </div>
		)
	}
});