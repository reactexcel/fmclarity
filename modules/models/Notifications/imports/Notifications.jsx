import { Model } from '/modules/core/ORM';
import NotificationSchema from './schemas/NotificationSchema.js';

if ( Meteor.isServer ) {
	Meteor.publish( 'Notifications', () => {
		return Notifications.find();
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
				Notifications.update( { 'recipient._id': user._id }, { $set: { read: true } }, { multi: true } );
			}
		}
	},
	setShown: {
		authentication: true,
		method: function( notification ) {
			//console.log( notification );
			Notifications.update( notification._id, { $set: { wasShown: true } } );
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
			let actorName = actor.name,
				actionName = action.name,
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
			return `${actorName} ${actionName} ${targetName}`;
		}
	}
} )

export default Notifications;
