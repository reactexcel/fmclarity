PageProperties = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var handle = Meteor.subscribe('facilities');
        return {
            facilities : Facilities.find({},{sort:{createdAt:-1}}).fetch()
        }
    },

    createNewFacility() {
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
						filters={filters}
						items={this.data.facilities}
						newItemCallback={this.createNewFacility}
						card={FacilityCard}
					/>
				</div>
			</div>
		);
	}
})