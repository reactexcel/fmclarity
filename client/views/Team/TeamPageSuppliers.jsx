SupplierIndexPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('contractors');
        var team, suppliers;
        team = FM.getSelectedTeam();
        if(team) {
            suppliers = team.getSuppliers();
        }
        return {
        	team : team,
            suppliers : suppliers
//            suppliers : Teams.find({type:"contractor"},{sort:{createdAt:-1}}).fetch()
        }
    },

    showModal(callback) {
        Modal.show({
            content:<TeamViewEdit onChange={callback} />
        })
    },

	render() {
        var team = this.data.team;
		return(
            <div>
                <div className="row wrapper page-heading">
                    <div className="col-lg-12">
                        <span style={{color:"#333",fontWeight:"bold",fontSize:"16px",lineHeight:"40px",marginLeft:"20px"}}>Suppliers</span>
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