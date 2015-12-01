PageDashboard = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {return(
    <div className="wrapper wrapper-content animated fadeIn">
        <div className="row" style={{margin:"5px 0 0 -20px"}}>
            <div className="col-lg-6 col-md-6 col-sm-12" style={{padding:"0 0 0 20px"}}>
	            <Box title="Work Requests">
	            	<div className="btn-group pull-right">
	            		<button className="btn btn-white"><i className="fa fa-th"></i> 6 Month</button>
	            	</div>
	            	<div className="row">
	            		<div className="col-md-12">
	            			<LineChart />
	            		</div>
	            	</div>
	            </Box>
	            <Box title="Building Overview">
	            	<div className="btn-group pull-right">
	            		<button className="btn btn-white"><i className="fa fa-th"></i> Month</button>
	            	</div>
	            	<div className="row" style={{textAlign:"center",clear:"both"}}>
						<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
							<ProgressArc title="Requests" value={{thisMonth:15,lastMonth:20}}/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
							<ProgressArc title="Open Requests" value={{thisMonth:15,lastMonth:20}} color="green"/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
							<ProgressArc title="Open Orders" value={{thisMonth:8,lastMonth:20}} color="orange"/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
							<ProgressArc title="Open Quotes" value={{thisMonth:5,lastMonth:8}}/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
							<ProgressArc title="Expired Insurance" value={{thisMonth:5,lastMonth:7}} color="green"/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
							<ProgressArc title="Supplier Reviews" value={{thisMonth:5,lastMonth:8}} color="orange"/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
							<ProgressArc title="Contracts Expiring" value={{thisMonth:5,lastMonth:7}} color="green"/>
				        </div>
						<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
							<ProgressArc title="Insurance Expiring" value={{thisMonth:5,lastMonth:8}} color="orange"/>
				        </div>
		            </div>
	            </Box>
	        </div>
            <div className="col-lg-6 col-md-6 col-sm-12" style={{padding:"0 0 0 20px"}}>
	            <Box title="Non-Compliant Items">
	            	<div className="btn-group pull-right">
	            		<button className="btn btn-white"><i className="fa fa-th"></i> 6 Month</button>
	            	</div>
	            	<BarChart />
	            </Box>
	            <Box title="Preventative Maintenance Planner">
	            	<Calendar />
	            </Box>
	        </div>
		</div>
	</div>
	);}
})