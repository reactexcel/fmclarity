Dashboard = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {return(
    <div className="wrapper wrapper-content animated fadeIn">
        <div className="row">
            <div className="col-lg-12">
				<Box title="Example table">
					<Table />
				</Box>
			</div>
		</div>
	</div>
	);}
})