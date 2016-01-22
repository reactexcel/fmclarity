
BaseProfilePageMixin = {

	// This mixin provides some basic functionality use by all profile style pages
	// - it handles checking for the currently selected team and returning it in the meteor data
	// - it handles taking an 'item' prop and returning that in the state
	// - it handles setting an updated item 

    mixins: [ReactMeteorData],

    getMeteorData() {
    	return {
    		selectedTeam:FM.getSelectedTeam()
    	}
    },

	getInitialState() {
		return {
			item:this.props.item
		}
	},

	componentWillReceiveProps(newProps) {
		this.setItem(newProps.item);
	},

	setItem(newItem) {
		this.setState({
			item:newItem
		});
	},


};
