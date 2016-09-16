import { FlowRouter } from 'meteor/kadira:flow-router';
import Action from './Action.js';
import Routes from './Routes.js';

export default class Route extends Action {
	constructor( ...args ) {
		super( ...args );
	}

	run( ...args ) {
		if( this.path ) {
			FlowRouter.go( this.path );
		}
	}

	register() {
		Routes.add( this );
	}
}