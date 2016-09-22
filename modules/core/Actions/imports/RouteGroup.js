/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import Route from './Route.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

/**
 * @memberOf 	module:core/Actions
 */
class RouteGroup {
	constructor( { name, onEnter } ) {
		this.name = name;
		if ( onEnter ) {
			this.group = FlowRouter.group( { triggersEnter: [ onEnter ] } );
		} else {
			this.group = FlowRouter.group();
		}
	}

	addOne( route ) {
		let { name, path, action } = route;
		if ( action == null ) {
			throw new Meteor.Error( `Route creation failed`, `Tried to create route "${name}" with no action` );
		}
		if ( !( route instanceof Route ) ) {
			new Route( route );
		}
		this.group.route( path, { name, action } );
	}

	add( routes ) {
		if ( !_.isArray( routes ) ) {
			routes = [ routes ];
		}

		routes.map( ( route ) => {
			this.addOne( route );
		} )
	}
}

export default RouteGroup;
