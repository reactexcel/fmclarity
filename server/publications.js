import { Teams } from '/modules/models/Teams';
import { Facilities } from '/modules/models/Facilities';
import { Requests } from '/modules/models/Requests';
import { Messages } from '/modules/models/Messages';
import { Files } from '/modules/models/Files';

import moment from 'moment';

Meteor.publish( 'User: Teams', function() {

    //teams I am a member in
    let teamsCursor = Teams.find( {
        $or: [
            { "owner._id": this.userId },
            { "members._id": this.userId }
        ]
    } );

    let teamIds = [];

    teamsCursor.forEach( ( team ) => {
        teamIds.push( team._id );
    } );

    return teamsCursor;
} );

Meteor.publish( 'Team: Last 10 Created', function( ) {
    let teamsCursor = Teams.find( { _id: { $ne: null } }, {
        sort: { createdAt: -1 },
        limit: 10
    } );
    return teamsCursor;
} );

Meteor.publish( 'Team: Facilities', function( teamId ) {
    let facilitiesCursor = Facilities.find( {
        'team._id': teamId
    }, {
        sort: {
            name: 1
        },
        fields: {
            _id: 1,
            address: 1,
            areas: 1,
            createdAt: 1,
            documents: 1,
            type: 1,
            'team._id': 1,
            'team.name': 1,
            name: 1,
            members: 1,
            suppliers: 1,
            operatingTimes: 1,
            'owner._id': 1,
            'owner.name': 1,
            lease: 1,
            levels: 1,
            description: 1,
            servicesRequired: 1,
            thumb: 1,
            size: 1,
            attachments: 1,
            realEstateAgency: 1,
            billingDetails: 1,
        }
    } );
    return facilitiesCursor;
} );


Meteor.publish( 'Request: Last 10 Complete', function( ) {

    console.log( this.userId );

    let requestsCursor = Requests.find( {
            'members._id': this.userId,
            status: 'Complete'
        }, {
        sort: {
            createdAt: -1
        },
        limit: 10,
        fields: {
            _id: 1,
            area: 1,
            attachments: 1,
            'assignee._id': 1,
            'assignee.name': 1,
            closeDetails: 1,
            code: 1,
            costThreshold: 1,
            createdAt: 1,
            description: 1,
            dueDate: 1,
            duration: 1,
            eta: 1,
            'facility._id': 1,
            'facility.name': 1,
            'facility.thumb': 1,
            frequency: 1,
            identifier: 1,
            issuedAt: 1,
            level: 1,
            members: 1,
            name: 1,
            'owner._id': 1,
            'owner.name': 1,
            priority: 1,
            service: 1,
            subservice: 1,
            'supplier._id': 1,
            'supplier.name': 1,
            supplierContacts: 1,
            status: 1,
            'team._id': 1,
            'team.name': 1,
            type: 1,
            unreadRecipents: 1,
        }
    } );

    /*
    requestsCursor.forEach( ( r ) => {
        if( r.status == 'Complete' ) {
            console.log( r.name );
        }
        else {
            console.log( r.status );
        }
    } );
    */

    return requestsCursor;
} );


Meteor.publish( 'Request: Last 10 Cancelled', function( ) {

    console.log( this.userId );

    let requestsCursor = Requests.find( {
            status: 'Cancelled'
        }, {
        sort: {
            createdAt: -1
        },
        limit: 10,
        fields: {
            _id: 1,
            area: 1,
            attachments: 1,
            'assignee._id': 1,
            'assignee.name': 1,
            closeDetails: 1,
            code: 1,
            costThreshold: 1,
            createdAt: 1,
            description: 1,
            dueDate: 1,
            duration: 1,
            eta: 1,
            'facility._id': 1,
            'facility.name': 1,
            'facility.thumb': 1,
            frequency: 1,
            identifier: 1,
            issuedAt: 1,
            level: 1,
            members: 1,
            name: 1,
            'owner._id': 1,
            'owner.name': 1,
            priority: 1,
            service: 1,
            subservice: 1,
            'supplier._id': 1,
            'supplier.name': 1,
            supplierContacts: 1,
            status: 1,
            'team._id': 1,
            'team.name': 1,
            type: 1,
            unreadRecipents: 1,
        }
    } );

    return requestsCursor;
} );


Meteor.publish( 'Requests: Complete', function( ) {

    console.log( this.userId );

    let requestsCursor = Requests.find( {
            status: 'Complete'
        }, {
        sort: {
            createdAt: -1
        },
        fields: {
            _id: 1,
            area: 1,
            attachments: 1,
            'assignee._id': 1,
            'assignee.name': 1,
            closeDetails: 1,
            code: 1,
            costThreshold: 1,
            createdAt: 1,
            description: 1,
            dueDate: 1,
            duration: 1,
            eta: 1,
            'facility._id': 1,
            'facility.name': 1,
            'facility.thumb': 1,
            frequency: 1,
            identifier: 1,
            issuedAt: 1,
            level: 1,
            members: 1,
            name: 1,
            'owner._id': 1,
            'owner.name': 1,
            priority: 1,
            service: 1,
            subservice: 1,
            'supplier._id': 1,
            'supplier.name': 1,
            supplierContacts: 1,
            status: 1,
            'team._id': 1,
            'team.name': 1,
            type: 1,
            unreadRecipents: 1,
        }
    } );

    /*
    requestsCursor.forEach( ( r ) => {
        if( r.status == 'Complete' ) {
            console.log( r.name );
        }
        else {
            console.log( r.status );
        }
    } );
    */

    return requestsCursor;
} );

Meteor.publish( 'User: Requests, Facilities', function( { teamId, includeComplete, includeFacilities } ) {

    import { Users } from '/modules/models/Users';
    import { Teams } from '/modules/models/Teams';


    let team = null,
        role = null,
        user = Users.findOne( this.userId ),
        query = [];

    if( teamId ) {
        team = Teams.findOne( teamId );
        role = team.getMemberRole( user );
        query.push( { $or: [
            { 'team._id': teamId },
            { 'supplier._id': teamId },
            { 'realEstateAgency._id': teamId }
        ] } );
        console.log( role );
        if( !_.contains( [ 'fmc support', 'portfolio manager' ], role ) ) {
            query.push( {
                'members._id': this.userId
            } )
        }
    }

    if ( !includeComplete ) {
        query.push ( {
            $and: [
                { status: { $nin: [ 'Deleted', 'Cancelled'] } },
            ]
        } );
    }

    let requestsCursor = Requests.find( { $and: query }, {
        sort: {
            createdAt: -1
        },
        fields: {
            _id: 1,
            area: 1,
            attachments: 1,
            bookingPeriod:1,
            'assignee._id': 1,
            'assignee.name': 1,
            closeDetails: 1,
            code: 1,
            costThreshold: 1,
            createdAt: 1,
            description: 1,
            dueDate: 1,
            duration: 1,
            eta: 1,
            'facility._id': 1,
            'facility.name': 1,
            'facility.thumb': 1,
            frequency: 1,
            identifier: 1,
            incidenceDate: 1,
            incidentFurtherComments: 1,
            incidentVictim: 1,
            issuedAt: 1,
            level: 1,
            memberName: 1,
            location: 1,
            members: 1,
            name: 1,
            numberOfPersons: 1,
            'owner._id': 1,
            'owner.name': 1,
            priority: 1,
            reporterContact: 1,
            service: 1,
            subservice: 1,
            'supplier._id': 1,
            'supplier.name': 1,
            supplierContacts: 1,
            status: 1,
            'team._id': 1,
            'team.name': 1,
            type: 1,
            unreadRecipents: 1,
        }
    } );

    if( !includeFacilities ) {
        return requestsCursor;
    }
    else {

        let facilityIds = [];

        requestsCursor.forEach( ( request ) => {
            if ( request.facility && request.facility._id ) {
                facilityIds.push( request.facility._id );
            }
        } )

        let facilitiesCursor = Facilities.find( { "_id": { $in: facilityIds } } );

        return [ facilitiesCursor, requestsCursor ];
    }
} );


Meteor.publish( 'User: Teams, Facilities, Requests, Documents, Messages', function() {
    let userId = this.userId;
    let teamsCursor = Teams.find( {
        $or: [ {
            "members._id": userId
        }, {
            "owner._id": userId
        } ]
    } );

    let teams = teamsCursor.fetch(),
        teamIds = _.pluck( teams, '_id' );

    console.log( teamIds );

    let facilitiesCursor = Facilities.find( {
        'team._id': { $in: teamIds }
    } );

    let facilities = facilitiesCursor.fetch(),
        facilityIds = _.pluck( facilities, '_id' );

    let facilityThumbs = facilities.map( ( facility ) => {
        if ( facility.thumb ) {
            return facility.thumb._id;
        }
    } );

    console.log( facilityThumbs );
    let thumbsCursor = Files.find( { '_id': { $in: facilityThumbs } } );

    let requestsCursor = Requests.find( {
        $or: [
            { 'team._id': { $in: teamIds } },
            { 'owner.id': userId }
        ]
    } )

    let requests = requestsCursor.fetch(),
        requestIds = _.pluck( requests, '_id' );

    let documentsCursor = Documents.find( {
        $or: [
            { 'team._id': { $in: teamIds } },
            { 'facility._id': { $in: facilityIds } },
            { 'request._id': { $in: requestIds } }
        ]
    } )

    let messagesCursor = Messages.find( {
        $or: [
            { 'team._id': { $in: teamIds } },
            { 'facility._id': { $in: facilityIds } },
            { 'request._id': { $in: requestIds } }
        ]
    } )

    return [ teamsCursor, facilitiesCursor, requestsCursor, documentsCursor, thumbsCursor ];
} )

Meteor.publish( 'Teams', function() {
    /*
    let userId = this.userId;
    console.log( userId );
    let teams = Teams.find( {
        $or: [ {
            "members._id": userId
        }, {
            "owner._id": userId
        } ]
    } );
    return teams;
    */
    return Teams.find();
} )

Meteor.publish( 'Suppliers', function( suppliers ) {
    if ( _.isArray( suppliers ) ) {
        let ids = [];
        suppliers.map( ( supplier ) => {
            if ( supplier && supplier._id ) {
                ids.push( supplier._id );
            }
        } )
        if ( ids.length ) {
            //console.log( ids );
            return Teams.find( { _id: { $in: ids } } );
        }
    }
    return Teams.find( { 'type': 'contractor' } );
} )
