/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { Roles } from '/modules/mixins/Roles';
import { Notifications } from '/modules/models/Notifications';

/**
 * An ActionGroup holds a collection of actions.
 * It is the primary structure used for passing around Action Groups and performing role based access control.
 * @memberOf		module:core/Actions
 * @requires 		module:mixins/Roles.Roles
 * @requires 		Notifications
 */
class ActionGroup {
	/**
	 * Create an ActionGroup.
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
	 * Add an action to the ActionGroup.
	 * @param {Action} action - An action to be added to this group.
	 */
	addOne( action ) {
		if ( action.name == null ) {
			throw new Meteor.Error( `Tried to create a new action without a name: ${JSON.stringify(action)}` );
		}
		this.actions[ action.name ] = action;
	}

	/**
	 * @class Action.ActionGroup
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

	clone( actionNames ) {
		let newActionGroup = new ActionGroup();
		if ( _.isArray( actionNames ) ) {
			//newActionGroup.actions = _.pluck( this.actions, actionNames );
			//newActionGroup.accessRules = _.pluck( this.actions, actionNames );
			actionNames.map( ( actionName ) => {
				let newAction = this.actions[ actionName ];
				newAccessRule = this.accessRules[ actionName ];
				if ( newAction ) {
					newActionGroup.actions[ actionName ] = newAction;
					newActionGroup.accessRules[ actionName ] = newAccessRule;
				}
			} )
		}
		return newActionGroup;
	}

	canAccess( actionName, userRole ) {
		return (
			this.accessRules[ actionName ] &&
			(
				this.accessRules[ actionName ][ userRole ] ||
				this.accessRules[ actionName ][ '*' ]
			)
		)
	}

	/**
	 *
	 */
	getVerb( { name } ) {
		//console.log( this.actions );
		//console.log( name );
		let action = this.actions[ name ];
		//console.log( action );
		if ( action ) {
			return action.verb;
		}
		return '';
	}

	getResult( { name }, item ) {
		let action = this.actions[ name ];
		if ( action && action.getResult ) {
			return action.getResult( item );
		}
	}

	/**
	 * Adds a single access rule to the group.
	 *
	 * Access rules can be added for each action.
	 * If access rules are added to the global action container "Actions" they will be evaluated before the pertaining action is run in any context.
	 * If they are added to another group they will be evaluated before the action is run using that group.
	 * An optional "condition" can be added which will filter available actions by comaparing the properties of the condition object to the access item passed to the action.
	 *
	 * The following creates an access rule for the action "complete request" that would apply to request items with the status "In Progress".
	 * The rule states that request members with the status 'supplier manager' or 'assignee' can perform the action.
	 * And that they should receive alerts when the action if performed by others.
	 *
	 * @example
	 * 	Actions.addAccessRule( {
	 *		condition: 	{ status: 'In Progress' },
	 * 		action: 	[ 'complete request' ],
	 * 		role: 		[ 'supplier manager', 'assignee' ],
	 * 		rule: 		{ alert: true }
	 *  });
	 *
	 * @param {Action} action - The action this new rule will pertain to.
	 * @param {array} roles - The roles that this rule is for.
	 * @param {object} condition - a "condition" object that will be matched against the access item to check that certain properties pertain
	 * @param {object} rile - The access rule we will add for this action
	 */
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

	/*
	 * Adds an array of access rules to the group.
	 *
	 * @class Action.ActionGroup
	 * @method Action.ActionGroup#addAccessRule
	 * @param {Action} action - The action this new rule will pertain to.
	 * @param {array} roles - The roles that this rule is for.
	 * @param {object} condition - a "condition" object that will be matched against the access item to check that certain properties pertain
	 * @param {object} rule - The access rule we will add for this action
	 */
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
	filter( actionNames, ...args ) {
		let validActions = {},
			item = args[ 0 ],
			relationships = Roles.getRoles( item );

		// this is phrased in a slightly awkward way because we don't know that the keys
		//  of the passed in will actually match the name property of the action itself
		actionNames.map( ( actionName ) => {
			let action = this.actions[ actionName ],
				rules = this.accessRules[ actionName ];

			//console.log( { rules, relationships } );

			if ( rules == null ) {
				console.log( `Tried to perform action '${actionName}' but access rules have not been defined` );
			} else {
				access = this.checkAccess( actionName, item, rules, relationships );
				if ( access.allowed ) {
					validActions[ actionName ] = action;
				}
			}
		} )

		return validActions;
	}

	handleAlerts( notificationRules, action, args, result ) {

		let user = Meteor.user(),
			userObj = {
				_id: user._id,
				name: user.profile.name
			};

		notificationRules.alert.map( ( recipient ) => {

			//console.log( recipient.profile.name );

			let recipientObj = {
					_id: recipient._id,
					name: recipient.profile.name
				},
				read = false;

			// if the current user performed the action then pre-mark the notification as read
			if ( user._id == recipient._id ) {
				//read = true;
				wasShown = true;
			}

			Notifications.save.call( {
				read,
				action,
				result,
				recipient,
				object: args,
				actor: userObj,
			} );
		} );
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
		//console.log( { rules, relationships } );

		if ( rules == null ) {
			console.log( `Tried to perform action '${actionName}' but access rules have not been defined` );
		}

		// ...that is why we precalculate rules and relationships then pass them here
		let access = this.checkAccess( actionName, item, rules, relationships ),
			notificationRules = this.checkAlerts( actionName, item, rules, relationships );

		if ( access.allowed ) {

			action.action( ...args, ( response ) => {
				// if the action has a path attached then modify the path in the url to reflect this

				// 

				if ( this.path ) {
					history.pushState( {}, '', this.path );
				}
				if ( access.alert ) {
					console.log( response );
					this.handleAlerts( notificationRules, action, args, response );
				}
				//if ( access.email ) {
					//handleEmails( notificationRules, action, args, result );
				//}
			} );

		} else {
			if( Meteor.isClient ) {
				toastr.error(`Access denied for action '${actionName}' `, "Access Denied");
			}
			throw new Meteor.Error( `Access denied for action '${actionName}' ` );
		}

	}

	/*
	 * @param 		{string} actionName
	 * @param 		{object} item
	 */
	getRulesAndRelationships( actionName, item ) {

		if ( !item ) {
			item = Session.getSelectedTeam();
		}

		let rules = this.accessRules[ actionName ],
			relationships = Roles.getRoles( item );

		return { rules, relationships };
	}


	/*
	 * @param 		{string} actionName
	 */
	getType( actionName ) {
		return this.actions[ actionName ].type;
	}


	/*
	 * @param 		{string} actionName
	 * @param 		{object} item
	 * @param 		{array} [rules]
	 * @param 		{object} [relationships]
	 */
	checkAccess( actionName, item, rules, relationships ) {

		//console.log( { rules, relationships } );

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

			if ( rules ) {

				// implement wildcard
				if ( rules[ '*' ] ) {
					let condition = rules[ '*' ].condition,
						valid = true;
					//console.log( condition );
					if ( condition ) {
						if ( _.isFunction( condition ) ) {
							valid = _.find( [ item ], condition );
						} else {
							valid = _.findWhere( [ item ], condition );
						}
					}
					if ( valid ) {
						access.allowed = access.allowed || rules[ '*' ].rule.allowed;
						access.alert = access.alert || rules[ '*' ].rule.alert;
						access.email = access.email || rules[ '*' ].rule.email;
					}

				} else if ( userRoles ) {

					// if any one of my relationships permits this action then I can do it
					userRoles.map( ( role ) => {
						if ( rules[ role ] ) {
							let condition = rules[ role ].condition,
								valid = true;
							//console.log( condition );
							if ( condition ) {
								if ( _.isFunction( condition ) ) {
									valid = _.find( [ item ], condition );
								} else {
									valid = _.findWhere( [ item ], condition );
								}
							}
							//console.log( condition );
							if ( valid ) {
								access.allowed = access.allowed || rules[ role ].rule.allowed;
								access.alert = access.alert || rules[ role ].rule.alert;
								access.email = access.email || rules[ role ].rule.email;
							}
						}
					} )
				}
			}
		}
		return access;
	}

	/*
	 * @param 		{string} actionName
	 * @param 		{object} item
	 * @param 		{array} [rules]
	 * @param 		{object} [relationships]
	 */
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

export default ActionGroup;
