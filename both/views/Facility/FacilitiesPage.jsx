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
		        return {
		        	ready:true,
		        	selectedTeam : selectedTeam,
		        	selectedFacility : selectedFacility,
		            facilities : facilities
		        }
	        }
        }
        return {
        	ready:false
        }
    },

    createNew() {
    	var selectedTeam = this.data.selectedTeam;
		FM.create("Facility",{
    		_team:{
    			_id:selectedTeam._id,
    			name:selectedTeam.name
    		}
    	});
    },

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {
		if(!this.data.ready) return <div/>
		return(
			<div>
		        <div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"60px"}}>
		          <div className="col-lg-12">
		            <h2 style={{marginTop:"16px"}}>Properties</h2>
		          </div>
		        </div>
		        <div className="facility-page wrapper wrapper-content animated fadeIn">
					<FilterBox2 
						items={this.data.facilities}
						itemView={{
							summary:FacilitySummary,
							detail:FacilityWidget
						}}
						newItemCallback={this.createNew}
					/>
				</div>
			</div>
		);
	}
})