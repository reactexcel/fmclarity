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

	run() {
		FlowRouter.go( this.path );
	}

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
