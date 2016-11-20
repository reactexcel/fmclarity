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

if ( Meteor.isServer ) {
	Messages.collection._ensureIndex( { 'team._id': 1 } );
	Messages.collection._ensureIndex( { 'facility._id': 1 } );
	Messages.collection._ensureIndex( { 'request._id': 1 } );
}

if ( Meteor.isServer ) {
	Meteor.publish( "Messages", () => {
		return Messages.find();
	} );

	Meteor.publish( "User: Messages", () => {
		return Messages.find( { 'inboxId._id': this.userId }, { sort: { createdAt: -1 }, limit: 50 } );
	} );

	Meteor.publish( "Inbox: Messages", function( ids ) {
		if ( !_.isArray( ids ) ) {
			ids = [ ids ];
		}
		return Messages.find( { 'inboxId.query._id': { $in: ids } }, { sort: { createdAt: -1 }, limit: 100 } );
	} );
}
