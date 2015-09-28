PageSuppliers = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {
		var filters = [
	      {
	        text:"All"
	      },
	      {
	        text:"Building"
	      },
	    ];
		return(
			<div>
		        <div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"60px"}}>
		          <div className="col-lg-12">
		            <h2 style={{marginTop:"16px"}}>Suppliers</h2>
		          </div>
		        </div>
		        <div className="wrapper wrapper-content animated fadeIn">
					<FilterBox
						items={Contracts}
						card={ContractCard}
						header={ContractCardTableHeader}
						filters={filters}
					/>
				</div>
			</div>
		);
	}
})