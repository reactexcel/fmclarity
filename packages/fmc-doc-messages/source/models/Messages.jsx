import { Model } from 'meteor/fmc:orm';
import MessageSchema from './MessageSchema.jsx';
import { DocOwners } from 'meteor/fmc:doc-owners';


export default Messages = new Model( {
	schema: MessageSchema,
	collection: "Messages",
	mixins: [ DocOwners ]
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

if ( Meteor.isServer ) {
	Meteor.publish( "messages", () => {
		return Messages.find();
	} );
}
