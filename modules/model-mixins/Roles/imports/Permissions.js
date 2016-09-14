import RolesMixin from './RolesMixin.js';

export default Permissions = {
	check( action, item, user ) {
		let roles = null;
		if ( item != null ) {
			roles = RolesMixin.getRoles( item );
		}
		return permissions[ action.name ];
	},

	checkAlerts( action, item ) {
		let roles = null,
			roleGroups = null,
			permission = permissions[ action.name ],
			recipients = {
				alert: [],
				email: []
			};

		if ( item != null ) {
			roles = RolesMixin.getRoles( item );
		}

		roleGroups = Object.keys( roles.roles );
		roleGroups.map( ( role ) => {
			if ( permission[ role ] ) {
				if ( permission[ role ].alert ) {
					recipients.alert = recipients.alert.concat( roles.roles[ role ] );
				}
				if ( permission[ role ].email ) {
					recipients.email = recipients.email.concat( roles.roles[ role ] );
				}
			}
		} )
		return recipients;
	},

	checkPermission( action, item, user ) {
		let roles = null,
			allowed = false,
			permission = permissions[ action.name ];

		if ( item != null ) {
			roles = RolesMixin.getRoles( item );
		}
		if( roles ) {
			userRoles = roles.actors[ user._id ];
			// if any one of my roles permits this action then I can do it
			userRoles.map( ( role ) => {
				if ( permission[ role ] ) {
					allowed = allowed || permission[ role ].allowed;
				}
			} )
		}
		return allowed;
	}
}

let permissions = {
	'check team roles': {
		manager: {
			allowed: true,
			alert: true,
			email: false
		}
	}
}
