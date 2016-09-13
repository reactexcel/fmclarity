export default class Action {

	constructor( { name, path, label, icon, description, action } ) {
		this.name = name;
		this.path = path;
		this.label = label;
		this.icon = icon;
		this.description = description;
		this.action = action;
	}

	bind( ...args ) {
		return {
			label:this.label,
			action:() => {
				return this.action( ...args );
			}
		}
	}
}
