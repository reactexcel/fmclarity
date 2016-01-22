FacilityIndexPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('teamsAndFacilitiesForUser');
        Meteor.subscribe('users');
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

	componentWillUnmount() {
		var items = this.data.facilities;
	    if(items) {
	    	items.map(function(item){
	    		if(item.isNew&&item.isNew()) {
	        		item.destroy();
	        	}
	      	})
	    }
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