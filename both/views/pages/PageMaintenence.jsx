PageMaintenence = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {return(
	<div>
		<div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"60px"}}>
		    <div className="col-lg-10">
		        <h2 style={{marginTop:"16px","float":"left"}}>Preventative Maintenence Planner</h2>
		        <ol className="breadcrumb" style={{margin:"23px 0 0 20px",float:"left"}}>
		            <li>
		                <a href="index.html">Tab 1</a>
		            </li>
		            <li className="active">
		                <strong>Tab 2</strong>
		            </li>
		        </ol>
		    </div>
		    <div className="col-lg-2">

		    </div>
		</div>		
	    <div className="wrapper wrapper-content animated fadeIn">
	        <div className="row">
	            <div className="col-lg-12">
				</div>
			</div>
		</div>
	</div>
	);}
})