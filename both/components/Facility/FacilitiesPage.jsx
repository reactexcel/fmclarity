PageProperties = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe('facilities');
        return {
            items : Facilities.find({},{sort:{createdAt:-1}}).fetch()
        }
    },

    createNew() {
    	Meteor.call("Facility.new");
    },

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
		        <div className="facility-page wrapper wrapper-content animated fadeIn">
					<FilterBox 
						items={this.data.items}
						filters={filters} 
						itemView={{
							summary:FacilitySummary,
							detail:FacilityDetail
						}}
						newItemCallback={this.createNew}
					/>
				</div>
			</div>
		);
	}
})