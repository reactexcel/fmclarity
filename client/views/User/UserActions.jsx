import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

// this kind of belongs in the model
// actually it's kind of a controller - but then again so is the RBAC actions spec
// can they be merged?

function addRoleBasedActions(menu,user,team) {
	if(team&&team.hasMember(user)) {
		var teamName = team.getName();

		if(!user.isLoggedIn()) {
			menu.push({
				label:"Remove from "+teamName,
				shouldConfirm:true,
				action(){
					team.removeMember(user);
					Modal.hide();
				}
			});
		}

		if(team.canSetMemberRole&&team.canSetMemberRole(user)) {
			var role = team.getMemberRole(user);
			var newRole = (role=='manager')?'staff':'manager';
			menu.push({
				label:((newRole=='manager')?'Promote to manager':'Demote to staff')+(' of '+teamName),
				shouldConfirm:true,
				action(){
					team.setMemberRole(user,newRole);
					Modal.hide();
				}
			})
		}
	}
}

UserActions = {
	getMenu:function(user,context) {
		var team = context.team;
		var facility = context.facility;
		var menu = [];

		addRoleBasedActions(menu,user,team);
		addRoleBasedActions(menu,user,facility);

		if(user) {
			menu.push({
				label:"Send email invitation",
				shoudConfirm:true,
				action() {
					user.sendInvite();
					Modal.hide();
				}
			});
		}
		return menu;
	}
}