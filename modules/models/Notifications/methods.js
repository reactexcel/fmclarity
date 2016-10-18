import { Notifications } from '/modules/models/Notifications';
import { Actions } from '/modules/core/Actions';

Meteor.methods( {
	'Notifications.create': function( item ) {
		let insertedId = Notifications.collection.insert( item ),
			notification = Notifications.findOne( insertedId ),
			action = Actions.actions[ item.action.name ];
		if ( item.emailSent ) {
			//Meteor.call( 'Messages.sendEmail', item.recipient, action.getEmail( notification ) )
		}
	},

	'Notifications.sendAll': function( notificationRules, actor, action, args, result ) {
		if ( Meteor.isServer ) {
			Meteor.defer( () => {
				for ( recipientId in notificationRules.alert ) {
					let recipient = notificationRules.alert[ recipientId ],
						read = false,
						wasShown = false,
						emailSent = notificationRules.email[ recipientId ] != null;

					// if the current actor performed the action then pre-mark the notification as read
					if ( actor._id == recipient._id ) {
						//read = true;
						//wasShown = true;
					}

					Meteor.call( 'Notifications.create', {
						read,
						wasShown,
						emailSent,
						action,
						result,
						recipient,
						object: args,
						actor,
					} );
				}

			} )
		}
	}
} )
