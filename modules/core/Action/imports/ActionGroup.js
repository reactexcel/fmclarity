import { RolesMixin } from '/modules/model-mixins/Roles';

export default class ActionGroup {
	constructor() {
		this.actions = {};
		this.accessRules = {};
	}

	addOne( action ) {
		if ( action.name == null ) {
			throw new Meteor.Error( `Tried to create a new action without a name: ${JSON.stringify(action)}` );
		}
		this.actions[ action.name ] = action;
	}

	add( actions ) {
		if ( !_.isArray( actions ) ) {
			actions = [ actions ];
		}

		actions.map( ( action ) => {
			this.addOne( action );
		} )
	}

	addAccessRule( actionName, role, rule ) {
		if ( this.accessRules[ actionName ] == null ) {
			this.accessRules[ actionName ] = {};
		}
		this.accessRules[ actionName ][ role ] = rule;
	}

	run( actionName, item, user ) {

		if ( user == null ) {
			user = Meteor.user();
		}

		if ( item == null ) {
			item = Session.getSelectedTeam();
		}

		let rules = this.accessRules[ actionName ],
			relationships = RolesMixin.getRoles( item );


		console.log( relationships );

		if ( rules == null ) {
			throw new Meteor.Error( `Tried to perform action '${actionName}' but access rules have not been defined` );
		}

		let alerts = this.checkAlerts( rules, relationships ),
			allowed = this.checkAccess( rules, relationships, user );

		console.log( alerts );
		console.log( allowed );
		if ( allowed ) {
			this.actions[ actionName ].run( item );
		} else {
			throw new Meteor.Error( `Access denied for action '${actionName}' ` );
		}

		//NotificationEngine.send( alerts );
	}


	checkAccess( rules, relationships, user ) {
		let allowed = false;
		if ( relationships ) {
			userRoles = relationships.actors[ user._id ];
			console.log( userRoles );
			// if any one of my relationships permits this action then I can do it
			userRoles.map( ( role ) => {
				if ( rules[ role ] ) {
					allowed = allowed || rules[ role ].allowed;
				}
			} )
		}
		return allowed;
	}

	checkAlerts( rules, relationships ) {
		let roleGroups = null,
			recipients = {
				alert: [],
				email: []
			};

		roleGroups = Object.keys( relationships.roles );
		roleGroups.map( ( role ) => {
			if ( rules[ role ] ) {
				if ( rules[ role ].alert ) {
					recipients.alert = recipients.alert.concat( relationships.roles[ role ] );
				}
				if ( rules[ role ].email ) {
					recipients.email = recipients.email.concat( relationships.roles[ role ] );
				}
			}
		} )
		return recipients;
	}
}
