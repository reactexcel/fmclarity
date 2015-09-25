PageProperties = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {
		var filters = [
	      {
	        text:"All",
	        filter:"*",
	        className:"active"
	      }
	    ];
		return(
			<FilterBox title="Properties" filters={filters}/>
		);
	}
})