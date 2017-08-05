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

Requests.collection._ensureIndex( { 'createdAt': 1 } );
Requests.collection._ensureIndex( { 'team._id': 1 } );
Requests.collection._ensureIndex( { 'owner._id': 1 } );
Requests.collection._ensureIndex( { 'members._id': 1 } );
