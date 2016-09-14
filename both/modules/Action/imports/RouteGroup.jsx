import { FlowRouter } from 'meteor/kadira:flow-router';

export default class RouteGroup {
	constructor( { name, onEnter } ) {
		this.name = name;
		this.group = FlowRouter.group( { triggersEnter: [ onEnter ] } );
	}

	addOne( { name, path, action } ) {
		console.log( { name, path, action } );
		if( action == null ) {
			throw new Meteor.Error(`Route creation failed`, `Tried to create route "${name}" with no action`);
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
