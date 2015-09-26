PageDashboard = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {return(
    <div className="wrapper wrapper-content animated fadeIn">
        <div className="row">
            <div className="col-lg-12">
	            <Box title="Work Requests">
	            	<div className="btn-group">
	            		<button className="btn btn-white"><i className="fa fa-th-list"></i> Day</button>
	            		<button className="btn btn-white"><i className="fa fa-th-large"></i> Week</button>
	            		<button className="btn btn-white"><i className="fa fa-th"></i> Month</button>
	            		<button className="btn btn-white"><i className="fa fa-th"></i> 3 Month</button>
	            	</div>
	            	<div className="row">
	            		<div className="col-md-12">
	            			<LineChart />
	            		</div>
	            	</div>
	            </Box>
	            <Box title="Work Requests">
	            	<div className="btn-group">
	            		<button className="btn btn-white"><i className="fa fa-th-list"></i> Day</button>
	            		<button className="btn btn-white"><i className="fa fa-th-large"></i> Week</button>
	            		<button className="btn btn-white"><i className="fa fa-th"></i> Month</button>
	            		<button className="btn btn-white"><i className="fa fa-th"></i> 3 Month</button>
	            	</div>
	            	<div className="row" style={{textAlign:"center"}}>
						<div className="col-lg-3 col-md-3 col-sm-6">
							<ProgressArc title="Requests" value={{thisMonth:15,lastMonth:20}}/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6">
							<ProgressArc title="Open Requests" value={{thisMonth:15,lastMonth:20}} color="green"/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6">
							<ProgressArc title="Open Orders" value={{thisMonth:8,lastMonth:20}} color="orange"/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6">
							<ProgressArc title="Open Quotes" value={{thisMonth:5,lastMonth:8}}/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6">
							<ProgressArc title="Expired Insurance" value={{thisMonth:5,lastMonth:7}} color="green"/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6">
							<ProgressArc title="Supplier Reviews" value={{thisMonth:5,lastMonth:8}} color="orange"/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6">
							<ProgressArc title="Open Requests" value={{thisMonth:5,lastMonth:7}} color="green"/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6">
							<ProgressArc title="Open Orders" value={{thisMonth:5,lastMonth:8}} color="orange"/>
				        </div>
		            </div>
	            </Box>
	            <Box title="Preventative Maintenence Planner">
	            	<div className="btn-group">
	            		<button className="btn btn-white"><i className="fa fa-th-list"></i> Day</button>
	            		<button className="btn btn-white"><i className="fa fa-th-large"></i> Week</button>
	            		<button className="btn btn-white"><i className="fa fa-th"></i> Month</button>
	            		<button className="btn btn-white"><i className="fa fa-th"></i> 3 Month</button>
	            	</div>
	            	<Calendar />
	            </Box>
	            <Box title="Active Building Compliance">
	            	<div className="btn-group">
	            		<button className="btn btn-white"><i className="fa fa-th-list"></i> Day</button>
	            		<button className="btn btn-white"><i className="fa fa-th-large"></i> Week</button>
	            		<button className="btn btn-white"><i className="fa fa-th"></i> Month</button>
	            		<button className="btn btn-white"><i className="fa fa-th"></i> 3 Month</button>
	            	</div>
	            	<BarChart />
	            </Box>
				<Box title="Properties">
					<Table />
				</Box>
			</div>
		</div>
	</div>
	);}
})