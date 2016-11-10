import { Model } from '/modules/core/ORM';
import NotificationSchema from './schemas/NotificationSchema.js';

if ( Meteor.isServer ) {

	Meteor.publish( 'User: Notifications', function() {
		return Notifications.find( { 'recipient._id': this.userId });
	} )

}

const Notifications = new Model( {
	schema: NotificationSchema,
	collection: "Notifications"
} )

// notifications.authenticatedMethods
Notifications.actions( {
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
			//console.log( notification );
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

export default Notifications;
