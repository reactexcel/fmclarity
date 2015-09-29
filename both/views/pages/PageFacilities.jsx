PageProperties = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {
		var filters = [
	     	{
	        	text:"All"
	      	},
	    	{
	      		text:"Office",
	      		filter(i) {
	      			return i.type=="Office"
	      		}
	    	},
	    	{
	     		text:"Residential",
	      		filter(i) {
	      			return i.type=="Residential"
	      		}
	  		}
	    ];
		return(
			<div>
		        <div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"60px"}}>
		          <div className="col-lg-12">
		            <h2 style={{marginTop:"16px"}}>Properties</h2>
		          </div>
		        </div>
		        <div className="wrapper wrapper-content animated fadeIn">
					<FilterBox
						filters={filters}
						items={Facilities}
						card={FacilityCard}
					/>
				</div>
			</div>
		);
	}
})