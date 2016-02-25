FacilityIndexPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('teamsAndFacilitiesForUser');
        Meteor.subscribe('users');
    	var user, selectedTeam, selectedFacility, facilties;
    	user = Meteor.user();
    	if(user) {
	        selectedTeam = Session.getSelectedTeam();
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
    	this.data.selectedTeam.addFacility(function(response){
    		var newItem = Facilities.findOne(response._id);
    		Modal.show({
            	content:<FacilityViewEdit item={newItem} />
            });
        })
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
		var team = this.data.selectedTeam;
		if(!this.data.ready) return <div/>
		return(		        
			<div>
				<div className="row wrapper page-heading">
				    <div className="col-lg-12">
	                	<span style={{color:"#333",fontWeight:"bold",fontSize:"16px",lineHeight:"40px",marginLeft:"20px"}}>Portfolio</span>
			        </div>
			    </div>
		        <div className="facility-page wrapper wrapper-content animated fadeIn">
					<FilterBox2 
						items={this.data.facilities}
						itemView={{
							summary:FacilitySummary,
							detail:FacilityCard
						}}
						newItemCallback={team.canAddFacility()?this.createNew:null}
					/>
				</div>
			</div>
		);
	}
})