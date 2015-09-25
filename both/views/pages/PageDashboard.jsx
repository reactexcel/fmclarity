PageDashboard = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {return(
    <div className="wrapper wrapper-content animated fadeIn">
        <div className="row">
            <div className="col-lg-12">
	            <Box title="Work Requests Line Chart">
	            	<div style={{height:"100px"}}></div>
	            </Box>
	            <Box title="Work Requests Progress Indicators">
	            	<div style={{height:"100px"}}></div>
	            </Box>
	            <Box title="PMP Calendar">
	            	<Calendar />
	            </Box>
	            <Box title="ABC Graphs">
	            	<div style={{height:"100px"}}></div>
	            </Box>
				<Box title="Properties">
					<Table />
				</Box>
			</div>
		</div>
	</div>
	);}
})