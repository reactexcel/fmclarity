import { Model } from '/modules/core/ORM';
import NotificationSchema from './NotificationSchema.js';

if( Meteor.isServer ) {
	Meteor.publish( 'Notifications', () => {
		return Notifications.find();
	})
}

export default Notifications = new Model( {
	schema: NotificationSchema,
	collection: "Notifications"
} )


