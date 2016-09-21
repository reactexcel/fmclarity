/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { FlowRouter } from 'meteor/kadira:flow-router';
import Action from './Action.js';
import Routes from './Routes.js';

/**
 * @memberOf  		module:core/Actions
 * @requires 		FlowRouter
 * @requires 		module:core/Actions.Action
 * @requires 		module:core/Actions.Routes
 * @extends 		module:core/Actions.Action
 */
class Route extends Action {
	constructor( ...args ) {
		super( ...args );
	}

	run( ...args ) {
		if ( this.path ) {
			FlowRouter.go( this.path );
		}
	}

	register() {
		Routes.add( this );
	}
}

export default Route;