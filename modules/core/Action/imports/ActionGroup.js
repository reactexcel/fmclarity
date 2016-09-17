import { RolesMixin } from '/modules/model-mixins/Roles';
import { Notifications } from '/modules/models/Notification';

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

	run( actionName, ...args ) {
		let item = args[ 0 ];
		// getting the rules and relationships is an expensive operation so we only want to do it
		//  once before running an action
		let { rules, relationships } = this.getRulesAndRelationships( actionName, item ),
			alerts = this.checkAlerts( actionName, item, rules, relationships ),
			access = this.checkAccess( actionName, item, rules, relationships );

		if ( rules == null ) {
			console.log( `Tried to perform action '${actionName}' but access rules have not been defined` );
		}

		if ( access.allowed ) {
			// perhaps this.actions[ actionName ].action( item );
			//  then [action].run() can be reserved for calling back to Actions.run( this ) so that access control can be enforced
			this.actions[ actionName ].run( ...args );
			Notifications.save.call( {
				actor: Meteor.user(),
				action: this.actions[ actionName ],
				object: args
			} );
		} else {
			throw new Meteor.Error( `Access denied for action '${actionName}' ` );
		}

	}

	getRulesAndRelationships( actionName, item ) {

		if ( !item ) {
			item = Session.getSelectedTeam();
		}

		let rules = this.accessRules[ actionName ],
			relationships = RolesMixin.getRoles( item );

		return { rules, relationships };
	}

	getType( actionName ) {
		return this.actions[ actionName ].type;
	}


	checkAccess( actionName, item, rules, relationships ) {

		if ( !item ) {
			item = Session.getSelectedTeam();
		}

		let user = Meteor.user(),
			access = {
				allowed: false,
				alert: false,
				email: false
			};

		if ( !rules && !relationships ) {
			var { rules, relationships } = this.getRulesAndRelationships( actionName, item, user );
		}

		if ( relationships ) {
			userRoles = relationships.actors[ user._id ];
			//console.log( userRoles );
			if ( rules && userRoles ) {
				// if any one of my relationships permits this action then I can do it
				userRoles.map( ( role ) => {
					if ( rules[ role ] ) {
						access.allowed = access.allowed || rules[ role ].allowed;
						access.alert = access.alert || rules[ role ].alert;
						access.email = access.email || rules[ role ].email;
					}
				} )
			} else {
				//console.log( `Action '${actionName}' has no members` );
			}
		}
		return access;
	}

	checkAlerts( actionName, item, rules, relationships ) {

		if ( !rules && !relationships ) {
			var { rules, relationships } = this.getRulesAndRelationships( actionName, item );
		}

		let roleGroups = null,
			recipients = {
				alert: [],
				email: []
			};

		if ( rules && relationships ) {
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
		}
		return recipients;
	}
}
