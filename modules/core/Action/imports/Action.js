import { Permissions } from '/modules/model-mixins/Roles';
//import { NotificationEngine } from '/modules/models/Notification';

import Actions from './Actions.js';

export default class Action {

	constructor( { name, type, path, label, icon, description, action, run } ) {
		this.name = name;
		this.path = path;
		this.type = type || 'team';
		this.label = label;
		this.icon = icon;
		this.description = description;
		this.action = action;

		if ( run != null ) {
			this.run = run;
		}
		this.register();
	}

	register() {
		Actions.add( this );
	}

	run( ...args ) {
		this.action( ...args );
		if( this.path ) {
			history.pushState({}, '', this.path);
		}
	}

	/*action( item ) {
		FlowRouter.go( this.path );
	}*/

	bind( ...args ) {
		return {
			label: this.label,
			icon: this.icon,
			run: () => {
				return this.run( ...args );
			}
		}
	}
}
