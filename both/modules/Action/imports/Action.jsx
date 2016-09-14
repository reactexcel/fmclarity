import { Permissions } from '/modules/model-mixins/Roles';

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
	}

	runnnn( item ) {
		let user = Meteor.user();
		console.log( Permissions.checkAlerts( this, item ) );
		console.log( Permissions.checkPermission( this, item, user ) );
		this.run( item );
	}

	run( item ) {
		FlowRouter.go( this.path );
	}

	bind( ...args ) {
		return {
			label: this.label,
			icon: this.icon,
			run: () => {
				return this.run( ...args );
			},
			runnnn: () => {
				return this.runnnn( ...args );
			}
		}
	}
}
