import React from 'react';

import { Action } from '/modules/core/Actions';
import { Modal } from '/modules/ui/Modal';
import { Roles } from '/modules/mixins/Roles';
import { AutoForm } from '/modules/core/AutoForm';
import { Documents, DocViewEdit } from '/modules/models/Documents';
import { Requests, RequestPanel, CreateRequestForm, CreatePPMRequestForm, SupplierCreateRequestForm, RequestActions ,PPM_Schedulers } from '/modules/models/Requests';
import { Facilities, FacilityStepperContainer, CreateSupplierFacility } from '/modules/models/Facilities';
import { Teams, TeamStepper,OwnerTeamStepper, TeamPanel } from '/modules/models/Teams';
import { Users, UserPanel, UserViewEdit } from '/modules/models/Users';
import { DropFileContainer } from '/modules/ui/MaterialInputs';
import moment from 'moment';

import CreateTeamRequest from './imports/actions/CreateTeamRequest';

const create = new Action( {
    name: 'create team',
    label: "Create team",
    icon: 'fa fa-group',
    action: (team, showFilter) => {
        team = Teams.create();
        Modal.show( {
            content: <DropFileContainer model={Teams}>
                <OwnerTeamStepper item = { team } showFilter={showFilter || false} />
            </DropFileContainer>
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
            content: <DropFileContainer model={Teams}>
                <TeamStepper item = { team } />
            </DropFileContainer>
        } )
    }
} )

const view = new Action( {
    name: 'view team',
    label: "View team",
    icon: 'fa fa-group',
    action: ( team ) => {
        Modal.show( {
            content: <DropFileContainer model={Teams}>
                <TeamPanel item = { team } />
            </DropFileContainer>
        } )
    }
} )

const destroy = new Action( {
    name: 'delete team',
    label: "Delete team",
    action: ( team ) => {
        //Facilities.destroy( team );
        team.destroy();
        Modal.hide()
    }
} )

const createFacility = new Action( {
    name: "create team facility",
    type: [ 'team' ],
    label: "Create new facility",
    icon: 'fa fa-building',
    action: ( team ) => {
        let item = {
            team: {
                _id: team._id,
                name: team.name
            }
        };
        newItem = Facilities.create( item );

        //newItem.setupCompliance( Config.compliance );

        item = Facilities.collection._transform( newItem );
        if ( Meteor.user().getRole() == "manager" ) {
            let clientsOfSupplier = team.getClientsOfSupplier();
            Modal.show( {
                content: <DropFileContainer model={Facilities}>
                    <CreateSupplierFacility clients={clientsOfSupplier} />
                </DropFileContainer>
            } )
        } else {
            Modal.show( {
                content: <DropFileContainer model={Facilities}>
                    <FacilityStepperContainer params = { { item } } />
                </DropFileContainer>
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
    action: ( team, callback, options ) => {
        let item = { team };
        if ( options ) {
            options.team = team;
            item = options
        }
        newItem = Requests.create( item );
        Modal.show( {
            content: <AutoForm
            title = "Please tell us a little bit more about the work that is required."
            model = { Requests }
            form = { Teams.isFacilityTeam( team ) ? CreateRequestForm : SupplierCreateRequestForm }
            item = { newItem }
            //submitText="Save"
            onChange = { () => { callback("update") } }
            onSubmit = {
                ( newRequest ) => {
                    if(newRequest.type == "Booking"){
                        newRequest = _.omit(newRequest,'bookingRules')
                        Meteor.call("Facilities.updateBookingForArea", newRequest)
                    }
                    /*Modal.replace( {
                        content: <DropFileContainer model={Requests} request={request}>
                                <RequestPanel item = { newRequest } callback={callback}/>
                            </DropFileContainer>
                    } );*/

                    let owner = Meteor.user();

                    newRequest.owner = {
                        _id: owner._id,
                        name: owner.profile ? owner.profile.name : owner.name
                    };
                    let request;
                    if(newRequest.type == "Preventative" || newRequest.type == 'Schedular'){
                      Meteor.call( 'PPM_Schedulers.create', newRequest );
                      request = PPM_Schedulers.findOne( { _id: newRequest._id } );
                    }else{
                      Meteor.call( 'Issues.create', newRequest );
                      request = Requests.findOne( { _id: newRequest._id } );
                    }
                    request.markAsUnread();
                    callback? callback( newRequest ): null;
                    Modal.replace( {
                        content: <DropFileContainer model = { Requests } request = { request }>
                                <RequestPanel item = { /*newRequest*/  request} callback = { callback }/>
                            </DropFileContainer>
                    } );
                }
            }
            />
        } )
    },
    // this function is a template for formatting / displaying the notification
    // it should default to a simple statement of the notification
    // notification: ( item ) => {}???
    getResult: ( item ) => {
            if ( item && item._id ) {
                let result = Requests.findOne( item._id );
                if ( result ) {
                    return {
                        text: ( result.code ? `#${result.code} - ` : '' ) + result.name,
                        href: ""
                    }
                }
            }
        }
        // this function returns the email template
} )

const createPPM_Schedulers = new Action( {
    name: "create team PPM request",
    type: [ 'team' ],
    label: "Create new request",
    verb: "created a work order",
    icon: 'fa fa-plus',
    // action should return restult and that gets used in the notification
    action: ( team, callback, options ) => {
        let item = { team };
        if ( options ) {
            options.team = team;
            item = options
        }
        newItem = PPM_Schedulers.create( item );
        newItem.type = "Schedular";
        Modal.show( {
            content: <AutoForm
            title = "Please tell us a little bit more about the scheduled task"
            model = { PPM_Schedulers }
            form = {CreatePPMRequestForm }
            item = { newItem }
            //submitText="Save"
            onChange = { () => { callback("update") } }
            onSubmit = {
                ( newRequest ) => {
                    if(newRequest.type == "Booking"){
                        Meteor.call("Facilities.updateBookingForArea", newRequest)
                    }

                    /*Modal.replace( {
                        content: <DropFileContainer model={Requests} request={request}>
                                <RequestPanel item = { newRequest } callback={callback}/>
                            </DropFileContainer>
                    } );*/

                    let owner = Meteor.user();

                    newRequest.owner = {
                        _id: owner._id,
                        name: owner.profile ? owner.profile.name : owner.name
                    };

                    Meteor.call( 'PPM_Schedulers.create', newRequest );
                    let request = PPM_Schedulers.findOne( { _id: newRequest._id } );
                    request.markAsUnread();
                    callback? callback( newRequest ): null;
                    Modal.replace( {
                        content: <DropFileContainer model = { PPM_Schedulers } request = { request }>
                                <RequestPanel item = { /*newRequest*/  request} callback = { callback }/>
                            </DropFileContainer>
                    } );
                }
            }
            />
        } )
    },
    // this function is a template for formatting / displaying the notification
    // it should default to a simple statement of the notification
    // notification: ( item ) => {}???
    getResult: ( item ) => {
            if ( item && item._id ) {
                let result = PPM_Schedulers.findOne( item._id );
                if ( result ) {
                    return {
                        text: ( result.code ? `#${result.code} - ` : '' ) + result.name,
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

const inviteSupplier = new Action( {
    name: 'invite supplier',
    label: "Invite supplier",
    type: [ 'team' ],
    action: ( supplier ) => {
        let inviter = Session.getSelectedTeam();
        //Meteor.call("Teams.sendSupplierInvite", supplier, inviter );
        //invite supplier
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
    type: [ 'team', 'user' ],
    label: 'Send reminder to suppliers',
    icon: 'fa fa-paper-plane-o',
    action: ( team ) => {
        let facilities = team.getFacilities(),
            statusFilter = { "status": { $nin: [ "Cancelled", "Deleted", "Closed", "Reversed", "PPM", "Rejected", "Complete" ] } }
        user = Meteor.user(),
            now = new Date(),
            requests = Requests.find( statusFilter ).fetch();
        requests = _.filter( requests, ( r ) => moment( r.dueDate ).isBefore( now ) );
        Meteor.call( "Issues.sendReminder", requests );
    }
} )

export {
    create,
    edit,
    view,
    destroy,

    createFacility,
    createRequest,
    CreateTeamRequest,
    createPPM_Schedulers,
    createDocument,
    removeSupplier,

    createMember,
    viewMember,
    inviteMember,
    editMember,
    destroyMember,
    removeMember,

    inviteSupplier,

    resetMemberTours,
    loginMember,
    sendReminder,
}
