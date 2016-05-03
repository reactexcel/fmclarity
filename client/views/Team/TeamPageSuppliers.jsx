SupplierIndexPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('contractors');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        var team, suppliers;
        team = Session.getSelectedTeam();
        facility = Session.getSelectedFacility();
        if(facility) {
            suppliers = facility.getSuppliers();
        }
        else if(team) {
            suppliers = team.getSuppliers();
        }
        return {
        	team : team,
            suppliers : suppliers,
            facility : facility
//            suppliers : Teams.find({type:"contractor"},{sort:{createdAt:-1}}).fetch()
        }
    },

    showModal(callback) {
        Modal.show({
            content:<TeamViewEdit facility={this.data.facility} onChange={callback} />
        })
    },

	render() {
        var team = this.data.team;
		return(
            <div>
                <div className="row wrapper page-heading">
                    <div className="col-lg-12">
                        <FacilityFilter title="Suppliers"/>
                    </div>
                </div>
    	        <div className="contacts-page wrapper wrapper-content animated fadeIn">
    				<FilterBox2 
    					items={this.data.suppliers}
    					newItemCallback={team&&team.canInviteSupplier()?this.showModal:null}
    					itemView={{
    						summary:Contact2LineWithAvatar,
    						detail:TeamCard
    					}}
    				/>
    			</div>
            </div>
		);
	}
})