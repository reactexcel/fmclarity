import { Requests } from '/modules/models/Requests';
import { PPMRequest } from '/modules/models/Requests';

Meteor.publish( 'Requests', () => {
    return Requests.find();
} );

Meteor.publish( 'Requests: Closed', () => {
    return Requests.find( { status: 'Closed' } );
} );

Meteor.publish( 'PPMRequest', () => {
    return PPMRequest.find();
} );

Meteor.publish( 'PPMRequest: Closed', () => {
    return PPMRequest.find( { status: 'Closed' } );
} );

Meteor.publish( 'Request: Last 20 Complete', function( ) {

    let requestsCursor = Requests.find( {
            status: 'Complete'
        }, {
        sort: {
            'lastUpdate': -1
        },
        limit: 20,
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
            invoiceDetails: 1,
            issuedAt: 1,
            lastUpdate: 1,
            level: 1,
            location: 1,
            members: 1,
            name: 1,
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



Meteor.publish( 'Requests: Complete', function( ) {

    console.log( this.userId );

    let requestsCursor = Requests.find( {
            'members._id': this.userId,
            status: 'Complete'
        }, {
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
            invoiceDetails: 1,
            issuedAt: 1,
            lastUpdate: 1,
            level: 1,
            location: 1,
            members: 1,
            name: 1,
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

Requests.collection._ensureIndex( { 'createdAt': 1 } );
Requests.collection._ensureIndex( { 'lastUpdate': 1 } );
Requests.collection._ensureIndex( { 'team._id': 1 } );
Requests.collection._ensureIndex( { 'owner._id': 1 } );
Requests.collection._ensureIndex( { 'members._id': 1 } );
