PageSuppliers = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {
		var filters = [
	      {
	        text:"Building",
	        filter:".metal"
	      },
	      {
	        text:"All",
	        filter:"*",
	        className:"active"
	      }
	    ];
		return(
			<FilterBox title="Suppliers" filters={filters}/>
		);
	}
})