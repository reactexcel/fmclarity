import { Model } from '/modules/core/ORM';
import NotificationSchema from './schemas/NotificationSchema.js';

if( Meteor.isServer ) {
	Meteor.publish( 'Notifications', () => {
		return Notifications.find();
	})
}

export default Notifications = new Model( {
	schema: NotificationSchema,
	collection: "Notifications"
} )


