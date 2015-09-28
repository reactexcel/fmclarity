PageContracts = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {
		// okay - so we really need to pass in a function here
		// seeing as this class is the only one aware of the 
		// structure of the data being sent in
		var filters = [
	      {
	        text:"All"
	      },
	      {
	        text:"Expired"
	      },
	      {
	        text:"Incomplete",
	        filter(i) {
	        	return i.clientExecuted==false;
	        }
	      }
	    ];
		return(
			<div>
		        <div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"60px"}}>
		          <div className="col-lg-12">
		            <h2 style={{marginTop:"16px"}}>Contracts</h2>
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