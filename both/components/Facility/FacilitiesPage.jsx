PageProperties = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('teamsAndFacilitiesForUser');
    	var user, selectedTeam, selectedFacility, facilties;
    	user = Meteor.user();
    	if(user) {
	        selectedTeam = user.getSelectedTeam();
    	    if(selectedTeam) {
	    	    selectedFacility = user.getSelectedFacility();
	        	facilities = selectedTeam.getFacilities();
	        }
        }
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
		return(
			<div>
		        <div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"60px"}}>
		          <div className="col-lg-12">
		            <h2 style={{marginTop:"16px"}}>Properties</h2>
		          </div>
		        </div>
		        <div className="facility-page wrapper wrapper-content animated fadeIn">
					<FilterBox2 
						items={this.data.items}
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