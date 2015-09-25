PageRequests = React.createClass({

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
	        text:"New",
	        filter:".metal"
	      },
	      {
	        text:"Open",
	        filter:".transition"
	      },
	      {
	        text:"Issued",
	        filter:".alkali, .alkaline-earth"
	      },
	      {
	        text:"Closed",
	        filter:":not(.transition)"
	      }
	    ];
		return(
			<FilterBox title="Work Requests" filters={filters}/>
		);
	}
})