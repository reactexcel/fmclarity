import { Permissions } from '/modules/model-mixins/Roles';
//import { NotificationEngine } from '/modules/models/Notification';

import Actions from './Actions.js';

export default class Action {

	constructor( { name, path, label, icon, description, action, run } ) {
		this.name = name;
		this.path = path;
		this.label = label;
		this.icon = icon;
		this.description = description;
		this.action = action;

		if ( run != null ) {
			this.run = run;
		}

		Actions.add(this);
	}

	run( item ) {
		this.action( item );
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
