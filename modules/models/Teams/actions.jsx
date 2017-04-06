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
import { DropFileContainer } from '/modules/ui/MaterialInputs';
import moment from 'moment';

const create = new Action( {
    name: 'create team',
    label: "Create team",
    icon: 'fa fa-group',
    action: ( team, callback ) => {
        team = Teams.create();
        Modal.show( {
            content: <DropFileContainer model={Teams}>
                <TeamStepper item = { team } onChange={( invitee ) => {
                    if (callback){
                        callback( _.pick(invitee, "name", "type", "_id" ) );
                    }
                }}/>;
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

// now that we are evaluating people based on their role in the request then we can perhaps actually
// have this located in request ( ie request.create ) rather than team.createRequest
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
            submitText="Save"
            onSubmit = {
                ( newRequest ) => {
                    Modal.replace( {
                        content: <DropFileContainer model={Requests} request={request}>
                                <RequestPanel item = { newRequest }/>
                            </DropFileContainer>
                    } );

                    let owner = Meteor.user();

                    newRequest.owner = {
                        _id: owner._id,
                        name: owner.profile ? owner.profile.name : owner.name
                    };

                    // this is a big of a mess - for starters it would be better placed in the create method
                    //  and then perhaps in its own function "canAutoIssue( request )"
                    let hasSupplier = newRequest.supplier && newRequest.supplier._id,
                        method = 'Issues.issue';
                    if ( newRequest.type != 'Preventative' && hasSupplier ) {
                        method = 'Issues.create';
                        let team = Teams.findOne( newRequest.team._id ),
                            role = Meteor.user().getRole( team ),
                            baseBuilding = ( newRequest.service && newRequest.service.data && newRequest.service.data.baseBuilding );
                        if( !team ) {
                            throw new Meteor.Error( 'Attempted to issue request with no requestor team' );
                            return;
                        }
                        else if( baseBuilding ) {
                            if( role == 'property manager' ) {
                                method = 'Issues.issue';
                            }
                        }
                        else if( !baseBuilding ) {

                            if( _.contains( [ 'portfolio manager', 'fmc support' ], role ) ) {
                                method = 'Issues.create';
                            }
                            else if( _.contains( [ 'manager', 'caretaker' ], role )) {
                                method = 'Issues.create';
                                let relation = team.getMemberRelation( owner ),
                                    costString = newRequest.costThreshold,
                                    costThreshold = null;

                                // strips out commas
                                //  this is a hack due to an inadequete implementation of number formatting
                                //  needs a refactor
                                if( _.isString( costString ) ) {
                                    costString = costString.replace(',','')
                                }

                                let cost = parseInt( costString );

                                if( relation.threshold ) {
                                    costThreshold = parseInt( relation.threshold );
                                }
                                else if( team.defaultCostThreshold ) {
                                    costThreshold = parseInt( team.defaultCostThreshold );
                                }

                                if( cost > costThreshold ) {
                                    method = 'Issues.create';
                                }
                                /*if( parseInt(relation.threshold) < 1 ) {
                                    method = 'Issues.create';
                                }
                                if(newRequest.haveToIssue == true){
                                    method = 'Issues.issue';
                                }
                                if( method == 'Issues.issue' ) {
                                    console.log('new threshold='+newThreshold.toString());
                                    team.setMemberThreshold( owner, newThreshold.toString() );
                                }*/
                            }

                            else if( _.contains( [ 'staff', 'tenant', 'support', 'resident' ], role )){
                                method == 'Issues.issue'
                            }
                        }
                        if(newRequest.haveToIssue == true){
                            method = 'Issues.issue';
                            newRequest = _.omit(newRequest,'haveToIssue')
                        }
                    }
                    Meteor.call( method, newRequest );
                    let request = Requests.findOne( { _id: newRequest._id } );
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
        console.log( { supplier } );
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
            statusFilter = { "status": { $nin: [ "Cancelled", "Deleted", "Closed", "Reversed", "PMP", "Rejected", "Complete" ] } }
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
    createDocument,

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
