/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import Actions from './Actions.js';

/**
 * An Action is a state-changing interaction available to the app user which is wrapped with authentication.
 * It is a primary structure used for role based access control.
 * @memberOf  		module:core/Actions
 * @requires 		module:core/Actions.Actions
 */
class Action {

	/**
	 * Create an Action.
	 * @param {string} name - The registered name of this action.
	 * @param {function} action - A function with the code for the action to be performed.
	 * @param {string} [type] - The type of model this action expects ie 'request', 'facility'
	 * @param {string} [path] - The url of this action, if provided then running the action changes the url to this.
	 * @param {string} [label] - Human readable name of the action used by interface elements.
	 * @param {string} [icon] - A css class that can be used to display an icon related to this action (used by interface elements).
	 * @param {string} [description] - A description of this action to be used by interface elements 
	 */
	constructor( { name, action, type, path, label, icon, verb, getResult, getEmail, description } ) {
		this.name = name;
		this.path = path;
		this.verb = verb;
		this.type = type || 'team';
		this.label = label;
		this.icon = icon;
		this.getResult = getResult;
		this.getEmail = getEmail || (() => {});
		this.description = description;
		this.action = action;

		// all actions are registered with the Actions singleton which then becomes the primary conduit for executing actions
		this.register();
	}

	/**
	 * Registers this action with the global ActionStore singleton.
	 */
	register() {
		Actions.add( this );
	}

	/**
	 * Runs the action by calling itself via the global ActionStore singleton.
	 * @param {...args} Arguments that will be passed on to the authentication and execution routine in ActionGroup.
	 */
	run( ...args ) {
		Actions.run( this, ...args );
	}

	/**
	 * Runs the action by calling itself via the global ActionStore singleton.
	 * @param {...args} Arguments that will be bound to a returned action then eventually passed on to the authentication and execution routine in ActionGroup.
	 * @returns A copy of the action which has the provided arguments bound to it - so it can be called without arguments.
	 */
	bind( ...args ) {
		return {
			label: this.label,
			verb: this.verb,
			icon: this.icon,
			run: () => {
				return this.run( ...args );
			}
		}
	}
}

export default Action;