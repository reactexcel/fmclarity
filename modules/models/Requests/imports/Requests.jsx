/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import { Model } from '/modules/core/ORM';

import RequestSchema from './schemas/RequestSchema.jsx';

import { Owners } from '/modules/mixins/Owners';
import { Roles } from '/modules/mixins/Roles';
import { Members } from '/modules/mixins/Members';
import { DocMessages } from '/modules/models/Messages';

import { Documents } from '/modules/models/Documents';
import { LoginService } from '/modules/core/Authentication';

import { Teams } from '/modules/models/Teams';
import { Users } from '/modules/models/Users';
import { SupplierRequestEmailView } from '/modules/core/Email';
import { OverdueWorkOrderEmailView } from '/modules/core/Email';

import moment from 'moment';

/**
 * @memberOf        module:models/Requests
 */
const Requests = new Model( {
    schema: RequestSchema,
    collection: "Issues",
    mixins: [
        [ Owners ],
        [ DocMessages, {
            helpers: {
                getInboxName() {
                    return "work order #" + this.code + ' "' + this.getName() + '"';
                },
                getWatchers( message ) {
                    let members = this.getMembers(),
                        newMembers = [];

                    //console.log({ request: this, message });

                    if ( message && message.verb == 'commented on' && this.status != 'New' ) {

                        //console.log( 'scenario 1' );

                        members.map( ( member ) => {
                            let roles = Roles.getRoles( this ),
                                memberRoles = roles.actors[ member._id ];

                            //console.log( memberRoles );

                            if ( this.service && this.service.data && this.service.data.baseBuilding == true ) {
                                //remove everyone who isn't pm
                                for( let i in memberRoles ) {
                                    let role = memberRoles[ i ];
                                    if( _.contains( [ 'property manager', 'supplier manager', 'assignee' ], role ) ) {
                                        newMembers.push( member );
                                        break;
                                    }
                                }
                            }
                            else {
                                //remove staff, tenant and resident
                                let rejectMember = false;
                                for( let i in memberRoles ) {
                                    let role = memberRoles[ i ];
                                    //console.log( role );
                                    if( _.contains( [ 'facility staff', 'facility tenant', 'facility resident' ], role ) ) {
                                        rejectMember = true;
                                        break;
                                    }
                                }
                                if( !rejectMember ) {
                                    newMembers.push( member );
                                }
                            }
                        } );
                    }
                    else {
                        newMembers = members;
                    }
                    //console.log( newMembers );
                    return newMembers;
                }
            }
        } ],
        [ Members ]
    ]
} )

Requests.save.before( ( request ) => {

    if ( request.type == "Preventative" ) {
        request.status = "PMP";
        request.priority = "PMP";
    } else if ( request.type == "Booking" ) {
        request.status = "Booking";
        request.priority = "Booking";
    }

    if ( request.costThreshold && ( request.costThreshold.length === 0 || !request.costThreshold.trim() ) ) {
        request.costThreshold = 0;
    }

    if ( request.supplier ) {
        request.supplier = {
            _id: request.supplier._id,
            name: request.supplier.name
        };
    }
    if ( request.team ) {
        request.team = {
            _id: request.team._id,
            name: request.team.name
        };
    }
} );

// *********************** this is an insecure temporary solution for updating status of requests ***********************

Requests.collection.allow( {
    update: function() {
        return true
    },
    remove: function() {
        return true
    },
} );

// ******************************************


var accessForTeamMembers = function( role, user, request ) {
    return (
        isEditable( request ) &&
        AuthHelpers.memberOfRelatedTeam( role, user, request )
    )
}

var accessForTeamManagers = function( role, user, request ) {
    return (
        isEditable( request ) &&
        AuthHelpers.managerOfRelatedTeam( role, user, request )
    )
}

var accessForTeamMembersWithElevatedAccessForManagers = function( role, user, request ) {
    return (
        (
            request.status == "Issued" &&
            AuthHelpers.managerOfRelatedTeam( role, user, request )
        ) ||
        (
            isEditable( request ) &&
            AuthHelpers.memberOfRelatedTeam( role, user, request )
        )
    )
}

//maybe actions it better terminology?
Requests.methods( {

    /* funtionality should be encapsulated in members */
    updateSupplierManagers: {
        authentication: true,
        helper: function( request ) {
            let supplierContacts = null;
            if ( request.supplierContacts && request.supplierContacts.length ) {
                supplierContacts = request.supplierContacts;
            } else {
                let supplier = request.getSupplier();
                if ( supplier ) {
                    if ( Teams.isFacilityTeam( supplier ) ) {
                        supplierContacts = supplier.getMembers( { role: 'portfolio manager' } );
                    } else {
                        supplierContacts = supplier.getMembers( { role: 'manager' } );
                    }
                }
            }
            if ( supplierContacts && supplierContacts.length ) {
                request.dangerouslyReplaceMembers( supplierContacts, {
                    role: "supplier manager"
                } );
            }
        }
    },

    getMessages: {
        authentication: true,
        helper: ( request ) => {
            let user = Meteor.user(),
                team = Session.getSelectedTeam(),
                userRole = team.getMemberRole( user ),
                query = null;

            if( Teams.isServiceTeam( team ) || userRole == 'fmc support'  ) {
                query = {
                    'inboxId.query._id': request._id
                }
            }
            else {
                query = {
                    $and: [
                        { 'inboxId.query._id': user._id },
                        { 'target.query._id': request._id }
                    ]
                }                
            }

            let messages = Messages.findAll( query, { sort: { createdAt: 1 } } );
            return messages;
        }
    },


    /* just seems to be a simple calculated field - in schema??, location.toString(), address.toString() */
    getLocationString: {
        authentication: true,
        helper: function( request ) {
            var str = '';
            if ( request.level && request.level.name ) {
                str += request.level.name;
                if ( request.area && request.area.name ) {
                    str += ( ', ' + request.area.name );
                    if ( request.identifier && request.identifier.name ) {
                        str += ( ', ' + request.identifier.name );
                    }
                }
            }
            return str;
        }
    },

    create: {
        authentication: true,
        method: function( request ) {
            let status = 'New';
            if ( request.costThreshold == "" ) {
                request.costThreshold = 0;
            }

            if ( request.type == 'Preventative' ) {
                status = 'PMP';
            } else if ( request.type == 'Booking' ) {
                status = 'Booking';
            }

            let code = null;
            if ( request && request.team ) {
                team = Teams.findOne( {
                    _id: request.team._id
                } );
                code = team.getNextWOCode();
            }

            let newRequestId = Meteor.call( 'Issues.save', request, {
                    status: status,
                    code: code,
                    members: getMembersDefaultValue( request )
                } ),
                newRequest = null;

            if ( newRequestId ) {
                newRequest = Requests.findOne( newRequestId );
            }

            if ( newRequest ) {
                let owner = null;
                if ( newRequest.owner ) {
                    owner = newRequest.getOwner();
                }
                newRequest.distributeMessage( {
                    message: {
                        verb: "created",
                        read: false,
                        subject: "A new work order has been created" + ( owner ? ` by ${owner.getName()}` : '' ),
                        body: newRequest.description
                    }
                } );
            }
            return newRequest;
        }
    },

    issue: {
        authentication: true,
        method: actionIssue
    },

    getContact: {
        authentication: true,
        helper: ( request ) => {
            let facility = request.getFacility();
            if( facility ) {
                // if the request is base building the contact should be the property manager, not the facility manager
                let team = Session.get( 'selectedTeam' ).type,
                    requestIsBaseBuilding = ( request && request.service && request.service.data && request.service.data.baseBuilding ),
                    role = 'manager';

                if( Teams.isFacilityTeam( team ) && requestIsBaseBuilding ) {
                    role = 'property manager';
                }
                let fms = facility.getMembers( { role } );
                if( fms && fms.length ) {
                    return fms[0];
                }
            }
        }
    },

    complete: {
        authentication: true,
        method: actionComplete
    },

    getCompleteRequest: {
        authentication: true,
        method: ( team, user ) => {
            let teamsCursor = Teams.find( {
                $or: [
                    { "owner._id": user._id },
                    { "members._id": user._id }
                ]
            } );

            let teamIds = [],
                teamNames = [];

            teamsCursor.forEach( ( team ) => {
                teamIds.push( team._id );
                teamNames.push( team.name );
            } );

            let requestsCursor = Requests.find( {
                $and: [
                    { status: { $in: [ "Closed", "Complete" ] } }, {
                        $or: [
                            { "team._id": { $in: teamIds } }, {
                                $and: [ {
                                        $or: [
                                            { "supplier._id": { $in: teamIds } },
                                            { "supplier.name": { $in: teamNames } },
                                        ]
                                    },
                                    { status: { $nin: [ "Draft", "New", "Issued" ] } }
                                ]
                            }, {
                                $or: [
                                    { "owner._id": user._id },
                                    { "members._id": user._id }
                                ]
                            }
                        ]
                    }
                ]
            }, { sort: { createdAt: -1 } } );
            return requestsCursor.fetch();
        }
    },
    /* services toString()*/

    getServiceString: {
        authentication: true,
        helper: function( request ) {
            var str = '';
            if ( request.service ) {
                str += request.service.name;
            }
            if ( request.subservice && request.subservice.name ) {
                str += ( ' - ' + request.subservice.name );
            }
            return str;
        }
    },

    getNextDate: {
        authentication: true,
        helper: ( request ) => {
            if ( request.frequency ) {
                let period = {},
                    unit = null,
                    dueDate = moment( request.dueDate ),
                    repeats = parseInt( request.frequency.repeats ),
                    freq = {
                        "daily": 'days',
                        "fortnightly": 'fortnights',
                        "weekly": 'weeks',
                        "monthly": 'months',
                        "quarterly": 'quarterly',
                        "annually": 'years',
                    };
                if ( request.frequency.unit == "custom" ) {
                    unit = request.frequency.period;
                    if ( request.frequency.unit == "fortnightly" || request.frequency.unit == "fortnights" )
                        unit = "weeks";
                    period[ unit ] = parseInt( request.frequency.number );
                    repeats = parseInt( request.frequency.number );
                } else {
                    if ( _.contains( Object.keys( freq ), request.frequency.unit ) ) {
                        unit = freq[ request.frequency.unit ];
                        repeats = parseInt( request.frequency.number )
                    } else {
                        unit = request.frequency.unit;
                    }
                    if ( request.frequency.unit == "fortnightly" || request.frequency.unit == "fortnights" )
                        unit = "weeks";
                    period[ unit ] = parseInt( request.frequency.number );
                }
                if ( request.frequency.unit == "fortnightly" || request.frequency.unit == "fortnights" ) {
                    period[ unit ] *= 2;
                }
                for ( var i = 0; i < repeats; i++ ) {

                    if ( dueDate.isAfter() ) {
                        return dueDate.toDate();
                    }
                    dueDate = dueDate.add( period );
                }
            }
        }
    },

    getPreviousDate: {
        authentication: true,
        helper: ( request ) => {
            if ( request.frequency ) {
                let period = {},
                    unit = null,
                    dueDate = moment( request.dueDate ),
                    repeats = parseInt( request.frequency.repeats ),
                    freq = {
                        "daily": 'days',
                        "fortnightly": 'weeks',
                        "weekly": 'weeks',
                        "monthly": 'months',
                        "quarterly": 'quarterly',
                        "annually": 'years',
                    };
                if ( request.frequency.unit == "custom" ) {
                    unit = request.frequency.period;
                    if ( request.frequency.unit == "fortnightly" || request.frequency.unit == "fortnights" )
                        unit = "weeks";
                    period[ unit ] = parseInt( request.frequency.number );
                    repeats = parseInt( request.frequency.number );
                } else {
                    if ( _.contains( Object.keys( freq ), request.frequency.unit ) ) {
                        unit = freq[ request.frequency.unit ];
                        repeats = parseInt( request.frequency.number )
                    } else {
                        unit = request.frequency.unit;
                    }
                    if ( request.frequency.unit == "fortnightly" || request.frequency.unit == "fortnights" )
                        unit = "weeks";
                    period[ unit ] = parseInt( request.frequency.number );
                }
                if ( request.frequency.unit == "fortnightly" || request.frequency.unit == "fortnights" ) {
                    period[ unit ] *= 2;
                }
                for ( var i = 0; i < repeats; i++ ) {

                    if ( dueDate.isAfter() ) {
                        return dueDate.subtract( period ).toDate();
                    }
                    dueDate = dueDate.add( period );
                }
            }
        }
    },

    findCloneAt: {
        authentication: true,
        helper: ( request, dueDate ) => {
            return Requests.findOne( {
                name: request.name,
                status: { $ne: 'PMP' },
                dueDate: dueDate
            } );
        }
    },

    getTimeliness: {
        authentication: true,
        helper: ( request ) => {
            if ( request.closeDetails && request.closeDetails.completionDate ) {
                var oneDay = 1000 * 60 * 60 * 24;
                var date1Ms = request.dueDate.getTime();
                var date2Ms = request.closeDetails.completionDate.getTime();
                var differenceMs = date1Ms - date2Ms;
                return Math.round( differenceMs / oneDay );
            }
        }
    },

    getNextRequest: {
        authentication: true,
        helper: ( request ) => {
            let nextDate = request.getNextDate(),
                nextRequest = null;

            if ( nextDate ) {
                nextRequest = Requests.findOne( {
                    name: request.name,
                    status: { $ne: 'PMP' },
                    dueDate: nextDate
                } );
            }
            return nextRequest;
        }
    },

    getPreviousRequest: {
        authentication: true,
        helper: ( request ) => {
            let previousDate = request.getPreviousDate();
            previousRequest = null;

            if ( previousDate ) {
                previousRequest = Requests.findOne( {
                    name: request.name,
                    status: { $ne: 'PMP' },
                    dueDate: previousDate
                } );
            }
            return previousRequest;
        }
    },

    getDocs: {
        authentication: true,
        helper: function( request ) {
            let docs = Documents.find( { request: { _id: request._id, name: request.name } } ).fetch();
            return _.map( docs, ( doc ) => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    type: doc.type,
                    description: doc.description,
                    private: doc.private,
                }
            } );
        }
    },

    destroy: {
        authentication: true,
        helper: function( request ) {
            Requests.remove( { _id: request._id } );
        }
    },

    getSupplier: {
        authentication: true,
        helper: function( request ) {
            let supplierQuery = request.supplier;
            if ( supplierQuery ) {
                let supplier = Teams.findOne( {
                    $or: [
                        { _id: supplierQuery._id },
                        { name: supplierQuery.name }
                    ]
                } );
                if ( supplier == null ) {
                    supplier = Teams.collection._transform( {} );
                }
                return supplier;
            }
        }
    },

    getTeam: {
        authentication: true,
        helper: function( request ) {
            let team = request.team;
            if ( team ) {
                let item = Teams.findOne( { _id: team._id } );
                return item != null ? item : Teams.collection._transform( {} );
            }
        }
    },

    getFacility: {
        authentication: true,
        helper: function( request ) {
            import { Facilities } from '/modules/models/Facilities';
            let query = request.facility;
            if ( query ) {
                let facility = Facilities.findOne( { _id: query._id } );
                return facility != null ? facility : Facilities.collection._transform( {} );
            }
        }
    },

    markRecipentAsRead: {
        authentication: true,
        method: function( request ) {
            let user = Meteor.user();
            if ( request.unreadRecipents && _.indexOf( request.unreadRecipents, user._id ) > -1 ) {
                Requests.update( { _id: request._id }, {
                    $pull: {
                        unreadRecipents: user._id
                    },
                    $push: {
                        readBy: { _id: user._id, readAt: new Date() }
                    }
                } )
            }
        }
    },

    setAssignee: {
        authentication: true,
        method: setAssignee
    },

    sendReminder: {
        authentication: true,
        method: actionSendReminder
    }

} )

Requests.helpers( {
    // this sent to schema config
    // or put in another package document-urls
    path: 'requests',
    getUrl() {
        return Meteor.absoluteUrl( this.path + '/' + this._id )
    },
    getEncodedPath() {
        return encodeURIComponent( Base64.encode( this.path + '/' + this._id ) );
    }
} );

Requests.helpers( {
    isOverdue: function() {
        return moment( this.dueDate )
            .isBefore();
    },
    isFollowUp: function() {
        return this.parent != null;
    },
} );

Requests.helpers( {
    //doc-attachments
    getAttachmentCount() {
        if ( this.attachments ) {
            return this.attachments.length;
        }
        return 0;
    },
} );


function actionCreate( request ) {

}

function setAssignee( request, assignee ) {

    Requests.update( request._id, {
        $set: {
            assignee: {
                _id: assignee._id,
                name: assignee.profile.name
            }
        }
    } );
    Requests.update( request._id, {
        $pull: {
            members: { role: "assignee" }
        }
    } );

    request = Requests.collection._transform( request );
    request.dangerouslyAddMember( request, assignee, { role: "assignee" } );
}


function actionIssue( request ) {

    let code = null,
        userId = Meteor.user(),
        user = Users.findOne( userId._id );

    if ( request ) {
        if ( request.code ) {
            code = request.code;
        } else if ( request.team ) {
            let team = Teams.findOne( {
                _id: request.team._id
            } );
            code = team.getNextWOCode();
        }
    }

    Meteor.call( 'Issues.save', request, {
        status: "Issued",
        issuedAt: new Date(),
        code: code,
        members: getMembersDefaultValue( request )
    } );


    request = Requests.findOne( request._id );

    if ( request ) {
        request.updateSupplierManagers();
        request = Requests.findOne( request._id );
        request.distributeMessage( {
            recipientRoles: [ "owner", "team", "team manager", "facility manager", "supplier" ],
            message: {
                verb: "issued",
                subject: "Work order #" + request.code + " has been issued",
            }
        } );

        var team = request.getTeam();
        request.distributeMessage( {
            recipientRoles: [ "supplier manager" ],
            suppressOriginalPost: true,
            message: {
                verb: "issued",
                subject: "New work request from " + " " + team.getName(),
                read: false,
                digest: false,
                emailBody: function( recipient ) {
                    var expiry = moment( request.dueDate ).add( { days: 14 } ).toDate();
                    var token = LoginService.generateLoginToken( recipient, expiry );
                    return DocMessages.render( SupplierRequestEmailView, { recipient: { _id: recipient._id }, item: { _id: request._id }, token: token } );
                }
            }
        } );

        return request;
    }
}


/*
 *
 *
 *
 */
function getMembersDefaultValue( item ) {

    if ( item.team == null || item.owner == null ) {
        return;
    }

    let owner = item.owner;
    let members = [ {
        _id: owner._id,
        name: owner.name,
        role: "owner"
    } ];

    if ( item.assignee && item.assignee._id ) {
        members.push( {
            _id: item.assignee._id,
            name: item.assignee.name,
            role: 'assignee'
        } )
    }

    // create team contacts
    let team = Teams.findOne( item.team._id );
    let teamMembers = team.getMembers( {
        role: "portfolio manager"
    } );
    teamMembers.map( ( m ) => {
        if ( m._id != owner._id ) {
            members.push( {
                _id: m._id,
                name: m.profile.name,
                role: "team manager"
            } )
        }
    } );


    // create facility contacts
    import { Facilities } from '/modules/models/Facilities';

    if ( item.facility ) {
        let facility = Facilities.findOne( item.facility._id );

        let facilityMembers = facility.getMembers( {
            role: { $in: [ 'manager', 'caretaker', 'property manager' ] }
        } );

        facilityMembers.map( ( member ) => {
            if ( member._id != owner._id ) {

                let role = member.getRole( facility );

                if ( role == 'property manager' ) {
                    if ( item.service.data && item.service.data.baseBuilding ) {
                        members.push( {
                            _id: member._id,
                            name: member.profile.name,
                            role: 'property manager'
                        } )
                    }
                } else {
                    members.push( {
                        _id: member._id,
                        name: member.profile.name,
                        role: `facility ${role}`
                    } )
                }
            }
        } );
    }

    return members;
}


function actionComplete( request ) {

    if ( request.closeDetails ) {
        if( request.closeDetails.jobCancelled == true ){
            request.closeDetails.furtherQuoteValue = 0;
        }
        if ( request.closeDetails.attachments ) {
            request.closeDetails.attachments.map( function( a ) {
                request.attachments.push( a );
            } );
        }
        if ( request.closeDetails.furtherQuote ) {
            request.attachments.push( request.closeDetails.furtherQuote );
        }
        if ( request.closeDetails.invoice ) {
            request.attachments.push( request.closeDetails.invoice );
        }
        if ( request.closeDetails.serviceReport ) {
            request.attachments.push( request.closeDetails.serviceReport );
        }
    }

    Meteor.call( 'Issues.save', request, {
        status: request.closeDetails.jobCancelled == true?'Close':'Complete'
    } );
    request = Requests.findOne( request._id );

    if ( request.closeDetails.furtherWorkRequired ) {

        console.log( 'further work required' );

        var closer = Meteor.user(),
            closerRole = closer.getRole();

        var newRequest = {
            owner: request.owner,
            team: request.team,
            facility: request.facility,
            supplier: request.supplier,

            level: request.level,
            area: request.area,
            attachments: request.attachments || [],
            status: "New",
            service: request.service,
            subservice: request.subservice,
            name: "FOLLOW UP - " + request.name,
            description: request.closeDetails.furtherWorkDescription,
            priority: request.closeDetails.furtherPriority || 'Scheduled',
            costThreshold: request.closeDetails.furtherQuoteValue
        };

        var team = Teams.findOne( request.team._id );
        if ( team ) {
            newRequest.code = team.getNextWOCode();
        }

        var response = Meteor.call( 'Issues.create', newRequest );
        var newRequest = Requests.findOne( response._id );
        //ok cool - but why send notification and not distribute message?
        //is it because distribute message automatically goes to all recipients
        //I think this needs to be replaced with distribute message

        //previous request WO# change to show the WO# of new request
        request.distributeMessage( {
            message: {
                verb: "raised follow up",
                subject: "Work order #" + request.code + " has been completed and a follow up has been requested",
                target: newRequest.getInboxId(),
                digest: false,
                read: true,
                /*alert: false*/
            }
        } );

        newRequest.distributeMessage( {
            message: {
                verb: "requested a follow up to",
                subject: closer.getName() + " requested a follow up to " + request.getName(),
                body: newRequest.description,
                target: request.getInboxId(),
                digest: false,
                read: true,
                /*alert: false*/
            }
        } );

        let roles = [ "portfolio manager", "facility manager", "team portfolio manager" ]
        if ( _.indexOf( roles, closerRole ) > -1 ) {
            Meteor.call( 'Issues.issue', newRequest );
        }


    } else if( request.closeDetails.jobCancelled == true ){
        request.distributeMessage( {
            message: {
                verb: 'closed',
                body: "JOB CANCELLED: "+request.closeDetails.comment,
                subject: "Work order #" + request.code + " has been closed"
            }
        } );
    } else {

        request.distributeMessage( {
            message: {
                verb: 'completed',
                subject: "Work order #" + request.code + " has been completed"
            }
        } );

    }

    return request;
}

function actionSendReminder( requests ) {
    requests.map( ( request ) => {
        request = Requests.findOne( request._id );
        team = request.getTeam();
        request.distributeMessage( {
            recipientRoles: [ "supplier manager" ],
            message: {
                subject: "Overdue Work order #" + request.code + " reminder",
                emailBody: function( recipient ) {
                    var expiry = moment( request.dueDate ).add( { days: 4 } ).toDate();
                    var token = LoginService.generateLoginToken( recipient, expiry );
                    return DocMessages.render( OverdueWorkOrderEmailView, { recipient: { _id: recipient._id }, item: { _id: request._id }, token: token } );
                }
            },
            suppressOriginalPost: true,
        } );
        if ( !request.sendFirstReminder ) {
            Requests.update( { _id: request._id }, {
                $set: {
                    firstReminderSent: true,
                }
            } )
        }
    } )
}

export default Requests;
