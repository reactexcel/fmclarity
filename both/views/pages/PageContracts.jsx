PageContracts = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {
		var filters = [
	      {
	        text:"All",
	        filter:"*",
	        className:"active"
	      },
	      {
	        text:"Expired",
	        filter:".metal"
	      },
	      {
	        text:"Incomplete",
	        filter:".transition"
	      }
	    ];
		return(
			<FilterBox title="Contracts" filters={filters}/>
		);
	}
})