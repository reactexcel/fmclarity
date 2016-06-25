import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

// this kind of belongs in the model
// actually it's kind of a controller - but then again so is the RBAC actions spec
// can they be merged?

function addRoleBasedActions(menu,user,team) {
	if(team&&team.hasMember(user)) {
		var teamName = team.getName();
		if(!user.isLoggedIn()&&team.canRemoveMember(user)&&team.collectionName!="Issues") {
			menu.push({
				label:"Remove from "+teamName,
				shouldConfirm:true,
				action(){
					team.removeMember(user);
					Modal.hide();
				}
			});
		}

		if(false&&team.ownerIs(user)) {
			menu.push({
				label:"Revoke ownership of "+teamName,
				shouldConfirm:true, //lets make this the default
				action() {
					team.clearOwner();
				}
			})
		}

		if(user&&team.canSendMemberInvite&&team.canSendMemberInvite(user)) {
			menu.push({
				label:"Send email invitation",
				action() {
					team.sendMemberInvite(user);
					Modal.hide();
				}
			});
		}
	}
}

UserActions = {
	getMenu:function(user,context) {
		var team = context.team;
		var facility = context.facility;
		var menu = [];

		addRoleBasedActions(menu,user,team);
		if(facility&&team&&(facility._id!=team._id)) {
			addRoleBasedActions(menu,user,facility);
		}

		//these really should do in RBAC
		if(user) {

			// Hmm, menu options global and dynamic
			// can be added within different packages
			// Probably want to follow flux pattern like modal
			if(user._id==Meteor.userId()) {
				menu.push({
					label:"Reset tutorials",
					shouldConfirm:true,
					action() {
						user.resetTours()
					}
				})
			}
			//
			else if(true) {
				menu.push({
					label:"Login",
					shouldConfirm:true,
					action() {
						user.login(function(){
							location.reload();
						});
					}
				})
			}
		}
		return menu;
	}
}