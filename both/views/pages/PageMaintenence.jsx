PageMaintenence = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {return(
	<div>
		<div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"60px"}}>
		    <div className="col-lg-12">
		        <h2 style={{marginTop:"16px"}}>Preventative Maintenence Planner</h2>
		    </div>
		</div>		
	    <div className="wrapper wrapper-content animated fadeIn">
	        <div className="row">
	            <div className="col-lg-12">
	            	<Box title="Calendar">
		            	<Calendar />
	            	</Box>
	            	<Box title="PMP Services Panel">
	            		<div style={{height:"100px"}}></div>
	            	</Box>
				</div>
			</div>
		</div>
	</div>
	);}
})