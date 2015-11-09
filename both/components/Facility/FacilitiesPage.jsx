PageProperties = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var selectedTeam = FM.getSelectedTeam();
        var selectedFacility = FM.getSelectedFacility();
        var facilities = selectedTeam?selectedTeam.getFacilities():Facilities.find({},{sort:{name:1}}).fetch();
        return {
        	selectedFacility : selectedFacility,
            items : facilities
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