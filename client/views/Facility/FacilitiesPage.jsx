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

    createNew(callback) {
    	var selectedTeam = this.data.selectedTeam;
		FM.create("Facility",{
    		team:{
    			_id:selectedTeam._id,
    			name:selectedTeam.name
    		}
    	},callback);
    },

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {
		if(!this.data.ready) return <div/>
		return(
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
		);
	}
})