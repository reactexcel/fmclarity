import React from 'react';

import { Action } from '/modules/core/Actions';
import { Modal } from '/modules/ui/Modal';
import { Roles } from '/modules/mixins/Roles';
import { AutoForm } from '/modules/core/AutoForm';
import { Documents, DocViewEdit } from '/modules/models/Documents';
import { Requests, CreateRequestForm } from '/modules/models/Requests';
import { Facilities, FacilityStepper } from '/modules/models/Facilities';
import { Teams, TeamStepper, TeamPanel } from '/modules/models/Teams';
import { Users, UserPanel, UserViewEdit } from '/modules/models/Users';

const create = new Action( {
	name: 'create team',
	label: "Create team",
	icon: 'fa fa-group',
	action: ( template ) => {
		let team = Teams.create( template );
		Modal.show( {
			content: <TeamStepper item = { team } />
		} )
	}
} )

const edit = new Action( {
	name: 'edit team',
	label: "Edit team",
	icon: 'fa fa-group',
	action: ( team ) => {
		let { roles, actors } = Roles.getRoles( team );
		//console.log( Roles.getRoles( team ) );
		Modal.show( {
			content: <TeamStepper item = { team } />
		} )
	}
} )

const view = new Action( {
	name: 'view team',
	label: "View team",
	icon: 'fa fa-group',
	action: ( team ) => {
		Modal.show( {
			content: <TeamPanel item = { team } />
		} )
	}
} )

const destroy = new Action( {
	name: 'delete team',
	label: "Delete team",
	action: ( team ) => {
		//Facilities.destroy( team );
		team.destroy();
	}
} )

const createFacility = new Action( {
	name: "create team facility",
	type: [ 'team' ],
	label: "Create new facility",
	icon: 'fa fa-building',
	action: ( team ) => {
		let item = { team };
		newItem = Facilities.create( item );

		//newItem.setupCompliance( Config.compliance );

		Modal.show( {
			content: <FacilityStepper item = { item } />
		} )
	}
} )

const createRequest = new Action( {
	name: "create team request",
	type: [ 'team' ],
	label: "Create new request",
	icon: 'fa fa-plus',
	action: ( team ) => {
		let item = { team };
		newItem = Requests.create( item );
		Modal.show( {
			content: <AutoForm
			model = { Requests }
			form = { CreateRequestForm }
			item = { newItem }
			onSubmit = {
				( request, form ) => {
					Meteor.call( 'Requests.create', request, {}, ( err, response ) => {
						Modal.replace( {
							content: <RequestPanel item = { response }/>
						} );
					} );
				}
			}
			/>
		} )
	}
} )

const createDocument = new Action( {
	name: "create team document",
	type: [ 'team' ],
	label: "Create new document",
	icon: 'fa fa-file',
	action: ( team ) => {
		let doc = {
			team: _.pick( team, '_id', 'name' )
		};
		let newDocument = Documents.create( doc );

		Modal.show( {
			content: <DocViewEdit item = { newDocument }/>
		} )
	}
} )

const removeSupplier = new Action( {
	name: "remove supplier",
	label: "Remove supplier",
	shouldConfirm: true,
	action: ( team, supplier ) => {
		// could put validated action with minimongo logic here???
		team.removeSupplier( supplier );
	}
} )

const createMember = new Action( {
	name: 'create team member',
	label: "Create member",
	type: [ 'team', 'user' ],
	action: ( team, member ) => {
		Modal.show( {
			content: <UserViewEdit/>
		} )
	}
} )

const editMember = new Action( {
	name: 'edit team member',
	label: "Edit member",
	type: [ 'team', 'user' ],
	action: ( team, member ) => {
		Modal.show( {
			content: <UserViewEdit item = { member } />
		} )
	}
} )

const viewMember = new Action( {
	name: 'view team member',
	label: "View member",
	type: [ 'team', 'user' ],
	action: ( team, member ) => {
		Modal.show( {
			content: <UserPanel item = { member } />
		} )
	}
} )

const destroyMember = new Action( {
	name: 'delete team member',
	label: "Delete member",
	type: [ 'team', 'user' ],
	action: ( team, member ) => {
		//Facilities.destroy( member );
		member.destroy();
	}
} )

const removeMember = new Action( {
	name: 'remove team member',
	label: "Delete member",
	type: [ 'team', 'user' ],
	action: ( team, member ) => {
		team.removeMember( member );
	}
} )

const inviteMember = new Action( {
	name: 'invite team member',
	label: "Send invite to member",
	type: [ 'team', 'user' ],
	action: ( team, member ) => {
		team.sendMemberInvite( member )
	}
} )

const resetMemberTours = new Action( {
	name: 'reset team member tours',
	label: "Reset member tours",
	type: [ 'team', 'user' ],
	action: ( team, member ) => {
		member.resetTours();
	}
} )


const loginMember = new Action( {
	name: 'login as team member',
	label: "Login as member",
	type: [ 'team', 'user' ],
	action: ( team, member ) => {
		member.login();
	}
} )


export {
	create,
	edit,
	view,
	destroy,

	createFacility,
	createRequest,
	createDocument,

	createMember,
	viewMember,
	inviteMember,
	editMember,
	destroyMember,
	removeMember,

	resetMemberTours,
	loginMember,


}