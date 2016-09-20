/**
 * @author       Leo keith <leo@fmclarity.com>
 * @copyright    2016 FM Clarity Pty Ltd.
 */

/**
 * The ActionGroup class holds a collection of actions and performs the role based access control
 * quickly and easily, without the need for any external files. You can create textures for sprites and in
 * coming releases we'll add dynamic sound effect generation support as well (like sfxr).
 */

import { RolesMixin } from '/modules/model-mixins/Roles';
import { Notifications } from '/modules/models/Notification';

export default class ActionGroup {
	/**
	 * @class Action.ActionGroup
	 * @constructor
	 * @param {object} actions - If actions are provided to the constructor the group is initialized with them
	 */
	constructor( actions ) {
		this.actions = {};
		this.accessRules = {};
		if ( actions ) {
			this.add( actions );
		}
	}

	/**
	 * @method Action.ActionGroup#addOne
	 * @param {Action} action - An action to be added to this group.
	 */
	addOne( action ) {
		if ( action.name == null ) {
			throw new Meteor.Error( `Tried to create a new action without a name: ${JSON.stringify(action)}` );
		}
		this.actions[ action.name ] = action;
	}

	/**
	 * @method Action.ActionGroup#add
	 * @param {array} actions - A list of actions to be sequentially added to the group
	 */
	add( actions ) {
		if ( !_.isArray( actions ) ) {
			actions = [ actions ];
		}

		actions.map( ( action ) => {
			this.addOne( action );
		} )
	}

	addOneAccessRule( action, roles, condition, rule ) {
		if ( this.accessRules[ action ] == null ) {
			this.accessRules[ action ] = {};
		}
		if ( !_.isArray( roles ) ) {
			roles = [ roles ];
		}
		roles.map( ( role ) => {
			this.accessRules[ action ][ role ] = { rule, condition };
		} )
	}

	addAccessRule( { action, role, condition, rule = {} } ) {
		if ( !_.isArray( action ) ) {
			action = [ action ];
		}
		if ( !rule.allowed ) {
			rule.allowed = true;
		}
		action.map( ( a ) => {
			this.addOneAccessRule( a, role, condition, rule );
		} )
	}

	/**
	 * Return a list of actions that are valid for the current user with the provided set of arguments.
	 * Used by WorkflowButtons
	 *
	 * @method Action.ActionGroup#filter
	 * @param {object} actions - A dictionary of actions that will be checked for availability.
	 * @param {...any} args - Arguments that will be used to check authentication for each action in this group.
	 * @return {array} An array of actions that are valid for this user with the provided args.
	 */
	filter( actions, ...args ) {
		let validActions = {},
			item = args[ 0 ],
			relationships = RolesMixin.getRoles( item );

		// this is phrased in a slightly awkward way because we don't know that the keys
		//  of the passed in will actually match the name property of the action itself
		for ( i in actions ) {
			let action = actions[ i ],
				actionAvailable = true,
				actionName = action.name,
				rules = this.accessRules[ actionName ];

			if ( rules == null ) {
				console.log( `Tried to perform action '${actionName}' but access rules have not been defined` );
				continue;
			}

			if ( actionAvailable ) {
				access = this.checkAccess( actionName, item, rules, relationships );
				if ( access.allowed ) {
					validActions[ actionName ] = action;
				}
			}
		}

		return validActions;
	}

	/**
	 * Runs the specified action performing checks to verify access and calculate notification requirements.
	 * The run function of the global ActionGroup store actions is called by individual actions for their rbac.
	 *
	 * @method Action.ActionGroup#run
	 * @param {string} actionName - the name of the action to run, if an Action object is passed the name is taken from that object
	 * @param {...any} args - Arguments that will be used to check authentication for each action in this group
	 */
	run( actionName, ...args ) {

		if ( _.isObject( actionName ) ) {
			actionName = actionName.name;
		}

		let item = args[ 0 ],
			action = this.actions[ actionName ];

		if ( action == null ) {
			console.log( `Tried to run action ${actionName} but it doesn't exist` );
		}

		// getting the rules and relationships is an expensive operation so we only want to do it
		//  once before running an action...
		let { rules, relationships } = this.getRulesAndRelationships( actionName, item );

		if ( rules == null ) {
			console.log( `Tried to perform action '${actionName}' but access rules have not been defined` );
		}

		// ...that is why we precalculate rules and relationships then pass them here
		let alerts = this.checkAlerts( actionName, item, rules, relationships ),
			access = this.checkAccess( actionName, item, rules, relationships );


		if ( access.allowed ) {
			action.action( ...args );
			if ( this.path ) {
				history.pushState( {}, '', this.path );
			}

			Notifications.save.call( {
				actor: Meteor.user(),
				action: action,
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
						let condition = rules[ role ].condition;
						console.log( condition );
						if ( !condition || _.findWhere( [ item ], condition ) ) {
							access.allowed = access.allowed || rules[ role ].rule.allowed;
							access.alert = access.alert || rules[ role ].rule.alert;
							access.email = access.email || rules[ role ].rule.email;
						}
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
				if ( rules[ role ] /* && rules[role].condition( item )*/ ) {
					if ( rules[ role ].rule.alert ) {
						recipients.alert = recipients.alert.concat( relationships.roles[ role ] );
					}
					if ( rules[ role ].rule.email ) {
						recipients.email = recipients.email.concat( relationships.roles[ role ] );
					}
				}
			} )
		}
		return recipients;
	}
}
