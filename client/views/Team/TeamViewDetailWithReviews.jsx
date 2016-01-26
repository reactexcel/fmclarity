TeamViewDetailWithReviews = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('users');
    	var team, orders;
    	team = this.props.item;
    	// would be nice to have a mixin to deal with this pattern
    	// would dry up the code alot
    	if(team) {
    		orders = Issues.find({"_supplier._id":team._id,status:"Closed"}).fetch();
	    }
    	return {
    		team:team,
    		reviews:orders||[]
    	}
    },

	render() {
		var team = this.data.team;
		var reviews = this.data.reviews;
		return (
			<div>
				<ContactSummary item={team} />
				<hr/>
				<div style={{padding:"10px"}}>
				{reviews.map(function(i,idx){
					return (
						<div className="row" key={idx}>
							<div className="col-md-12">
								<Message item={i} />
							</div>
						</div>
					)
				})}
				</div>
			</div>
		)
	}
});