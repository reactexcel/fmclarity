import { Model } from '/modules/core/ORM';
import { Owners } from '/modules/mixins/Owners';

import MessageSchema from './schemas/MessageSchema.jsx';

export default Messages = new Model( {
	schema: MessageSchema,
	collection: "Messages",
	mixins: [ Owners ]
} );

Messages.helpers( {
	getInbox() {
		var inboxId = this.inboxId;
		var collection = ORM.collections[ inboxId.collectionName ];
		return collection.findOne( inboxId.query );
	},
	getTarget() {
		var target = this.target;
		var collection = ORM.collections[ target.collectionName ];
		if ( collection ) {
			return collection.findOne( target.query );
		}
	},
	getTargetId() {
		var target = this.target ? this.target : this.inboxId;
		return target.query ? target.query._id : null;
	},
	getTargetName() {
		var target = this.target ? this.target : this.inboxId;
		return target.name;
	},
	getTargetUrl() {
		var target = this.target ? this.target : this.inboxId;
		//console.log(target);
		//return FlowRouter.path(target.path,target.query);
		if ( target.path ) {
			//return '/'+target.path+'/'+target.query._id;
			return Meteor.absoluteUrl( target.path + '/' + target.query._id );
		}
	},
	getAbsoluteTargetUrl() {
		var target = this.target ? this.target : this.inboxId;
		//console.log(target);
		//return FlowRouter.path(target.path,target.query);
		if ( target.path ) {
			return Meteor.absoluteUrl( target.path + '/' + target.query._id );
		}
	},
	getEncodedAbsoluteTargetUrl() {
		var target = this.target ? this.target : this.inboxId;
		//console.log(target);
		//return FlowRouter.path(target.path,target.query);
		if ( target.path ) {
			//return Meteor.absoluteUrl( target.path + '/' + target.query._id );
			return encodeURIComponent( Base64.encode( target.path + '/' + target.query._id ) );
		}
	}
} );

Messages.methods( {
	create: {
		authentication: true,
		method: RBAC.lib.create.bind( Messages )
	},
	/*save: {
		authentication: true,
		method: RBAC.lib.save.bind( Messages )
	},*/
	destroy: {
		authentication: true,
		method: RBAC.lib.destroy.bind( Messages )
	}
} )

Messages.actions( {
	markAsRead: {
		authentication: true,
		method: function( { user } ) {
			//console.log( user );
			if ( user ) {
				Messages.update( { 'inboxId.query._id': user._id }, { $set: { read: true } }, { multi: true } );
			}
		}
	},
	setShown: {
		authentication: true,
		method: function( notification ) {
			Messages.update( notification._id, { $set: { wasShown: true } } );
		}
	},
	//Mark all the notification as shown
	setAllShown: {
		authentication: true,
		method: function( notifications ) {
			let show = false;
			_.map( notifications, ( n ) => {
				Messages.update( n._id, { $set: { wasShown: true } } );
				show = true;
			});
			return show;
		}
	},

	// notifications.authenticatedHelpers

	getBody: {
		authentication: true,
		helper: () => {
			return ''
		}
	},

	getSubject: {
		authentication: true,
		helper: ( { actor, action, object } ) => {
			let actorName = actor.profile.name,
				actionName = action.name,
				actionVerb = action.verb,
				targetName = "Unknown";

			if ( object ) {
				target = object[ 0 ];
			}

			if ( target ) {
				if ( target.profile ) {
					targetName = target.profile.name;
				} else {
					targetName = target.name;
				}
			}
			return `${actorName} ${actionVerb} ${targetName}`;
		}
	}
} )


if ( Meteor.isServer ) {
	Messages.collection._ensureIndex( { 'team._id': 1 } );
	Messages.collection._ensureIndex( { 'facility._id': 1 } );
	Messages.collection._ensureIndex( { 'request._id': 1 } );
}

if ( Meteor.isServer ) {
	Meteor.publish( "Messages", function() {
		return Messages.find();
	} );

	Meteor.publish( "User: Messages", function() {
		
		import { Requests } from '/modules/models/Requests';

		let messagesCursor = Messages.find( { 'inboxId.query._id': this.userId }, { sort: { createdAt: -1 }, limit: 50 } ),
			requestsCursor = [],
			ids = [];

		messagesCursor.forEach( ( message ) => {
			if( message && message.target ) {
				let target = message.target;
				if( target.path = 'requests' && target.query != null ) {
					ids.push( target.query._id );
				}
			}
		} )

		if( ids.length ) {
			requestsCursor = Requests.find( { _id:{ $in: ids } } );
		}

		return [ messagesCursor, requestsCursor ];
	} );

	Meteor.publish( "Inbox: Messages", function( ids ) {
		if ( !_.isArray( ids ) ) {
			ids = [ ids ];
		}
		return Messages.find( { 
			$and: [
				{ 'inboxId.query._id': this.userId },
				{ 'target.query._id': { $in: ids } }
			]
		}, { sort: { createdAt: -1 }, limit: 100 } );
	} );
}
