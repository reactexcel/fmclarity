import React from 'react';

import { Action } from '/modules/core/Actions';
import { Modal } from '/modules/ui/Modal';
import { Roles } from '/modules/mixins/Roles';
import { AutoForm } from '/modules/core/AutoForm';
import { Documents, DocViewEdit } from '/modules/models/Documents';
import { Requests, RequestPanel, CreateRequestForm, SupplierCreateRequestForm, RequestActions } from '/modules/models/Requests';
import { Facilities, FacilityStepperContainer, CreateSupplierFacility } from '/modules/models/Facilities';
import { Teams, TeamStepper, TeamPanel } from '/modules/models/Teams';
import { Users, UserPanel, UserViewEdit } from '/modules/models/Users';
import moment from 'moment';

const create = new Action( {
	name: 'create team',
	label: "Create team",
	icon: 'fa fa-group',
	action: () => {
		let team = Teams.create();
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
		let item = { team:{
			_id: team._id,
			name: team.name
		} };
		console.log(CreateSupplierFacility);
		newItem = Facilities.create( item );

		//newItem.setupCompliance( Config.compliance );

		item = Facilities.collection._transform( newItem );
		if( Meteor.user().getRole() == "manager" ) {
			Modal.show({
				content: <CreateSupplierFacility />
			})
		} else {
			Modal.show( {
				content: <FacilityStepperContainer params = { { item } } />
			} )
		}
	}
} )

const createRequest = new Action( {
	name: "create team request",
	type: [ 'team' ],
	label: "Create new request",
	verb: "created a work order",
	icon: 'fa fa-plus',
	// action should return restult and that gets used in the notification
	action: ( team, callback ) => {
		let item = { team };
		newItem = Requests.create( item );
		Modal.show( {
			content: <AutoForm
				title 	= "Please tell us a little bit more about the work that is required."
				model 	= { Requests }
				form 	= { team.type=='fm'?CreateRequestForm:SupplierCreateRequestForm }
				item 	= { newItem }
				onSubmit = {
					( newRequest ) => {
						Modal.replace( {
							content: <RequestPanel item = { newRequest }/>
						} );
						let team = Teams.findOne( newRequest.team._id ),
							role = Meteor.user().getRole( team );


						let owner = Meteor.user();
						newRequest.owner = {
							_id: owner._id,
							name: owner.profile?owner.profile.name:owner.name
						};

						if ( newRequest.type == 'Preventative' ) {
							Meteor.call('Issues.create', newRequest );
							//RequestActions.clone.run( newRequest );
						}
						else if( _.contains( ['portfolio manager', 'fmc support' ], role ) && newRequest.supplier && newRequest.supplier._id  ) {
							Meteor.call('Issues.issue', newRequest );
						}
						else {
							Meteor.call('Issues.create', newRequest );
						}

						let request = Requests.collection._transform( newRequest );
						request.markAsUnread();
						//callback( newRequest );
					}
				}
			/>
		} )
	},
	// this function is a template for formatting / displaying the notification
	// it should default to a simple statement of the notification
	// notification: ( item ) => {}???
	getResult: ( item ) => {
		if( item && item._id ) {
			let result = Requests.findOne( item._id );
			if( result ) {
				return {
					text: (result.code?`#${result.code} - `:'')+result.name,
					href: ""
				}
			}
		}
	}
	// this function returns the email template
} )

const createDocument = new Action( {
	name: "create team document",
	type: [ 'team' ],
	label: "Create new document",
	icon: 'fa fa-file',
	action: ( team ) => {
		let type = "team",
			_id = team._id,
			name = team.name;

		let newDocument = Documents.create( {
			team: { _id, name },
			owner: { type, _id, name }
		} );

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
	action: ( team, member, addPersonnel ) => {
		Modal.show( {
			content: <UserViewEdit addPersonnel = { addPersonnel }/>
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
	action: ( { user, group } ) => {
		group.sendMemberInvite( user )
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


const sendReminder = new Action( {
 	name: 'send supplier reminders',
 	type: [ 'team', 'user'],
 	label: 'Send reminder to suppliers',
 	icon: 'fa fa-paper-plane-o',
 	action: ( team ) => {
		let facilities = team.getFacilities(),
			statusFilter = { "status": { $nin: [ "Cancelled", "Deleted", "Closed", "Reversed", "PMP", "Rejected", "Complete" ] } }
			user = Meteor.user(),
			now = new Date(),
			requests = Requests.find( statusFilter ).fetch();
			requests = _.filter( requests, (r) => moment( r.dueDate ).isBefore( now ) );
			Meteor.call("Issues.sendReminder", requests );
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
	sendReminder,

}
