import { Teams } from '/modules/models/Teams';
import { Facilities } from '/modules/models/Facilities';
import { Requests } from '/modules/models/Requests';
import { Messages } from '/modules/models/Messages';
import { Files } from '/modules/models/Files';

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

} );

Meteor.publish( 'User: Facilities, Requests', function( includeComplete ) {

    //teams I am a member in
    let teamsCursor = Teams.find( {
        $or: [
            { "owner._id": this.userId },
            { "members._id": this.userId }
        ]
    } );

    let teamIds = [],
        teamNames = [];

    teamsCursor.forEach( ( team ) => {
        teamIds.push( team._id );
        teamNames.push( team.name );
    } );

    let query = {
        $or: [
            { "team._id": { $in: teamIds } }, {
                $and: [ {
                        $or: [
                            { "supplier._id": { $in: teamIds } },
                            { "supplier.name": { $in: teamNames } },
                        ]
                    },
                    { status: { $nin: [ "Draft", "New" ] } }
                ]
            }, {
                $or: [
                    { "owner._id": this.userId },
                    { "members._id": this.userId }
                ]
            }
        ]
    };

    if ( !includeComplete ) {
        query = {
            $and: [
                { status: { $nin: [ 'Deleted', 'Cancelled', 'Complete' ] } },
                query
            ]
        };
    }

    let requestsCursor = Requests.find( query, { sort: { createdAt: -1 } } );
    let facilityIds = [];

    /* this seems a bit expensive given that it will be producing small results */
    requestsCursor.forEach( ( request ) => {
        if ( request.facility && request.facility._id ) {
            facilityIds.push( request.facility._id );
        }
    } )

    //find all of the facilities that are in those teams
    let facilitiesCursor = Facilities.find( {
        $or: [
            { "team._id": { $in: teamIds } },
            { "_id": { $in: facilityIds } }
        ]
    } );

    return [ facilitiesCursor, requestsCursor ];
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