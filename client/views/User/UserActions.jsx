// this kind of belongs in the model
// actually it's kind of a controller - but then again so is the RBAC actions spec
// can they be merged?

UserActions = {
	getMenu:function(user,context) {
		var team = context.team;
		var facility = context.facility;

		var menu = [];

		if(team&&team.hasMember(user)) {

			if(!user.isLoggedIn()) {
				menu.push({
					label:"Remove from "+team.getName(),
					shouldConfirm:true,
					action(){
						team.removeMember(user);
						Modal.hide();
					}
				});
			}

			if(team.canSetMemberRole&&team.canSetMemberRole(user)) {
				var role = team.getRole(user);
				var newRole = (role=='manager')?'staff':'manager';
				menu.push({
					label:(newRole=='manager')?'Promote to manager':'Demote to staff',
					shouldConfirm:true,
					action(){
						team.setMemberRole(user,newRole);
						Modal.hide();
					}
				})
			}
		}

		if(facility&&facility.hasMember(user)) {
			menu.push({
				label:"Remove from "+facility.getName(),
				shouldConfirm:true,
				action(){
					facility.removeMember(user);
					Modal.hide();
				}
			});
		}

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