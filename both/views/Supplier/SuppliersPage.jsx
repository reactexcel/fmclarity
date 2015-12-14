PageSuppliers = React.createClass({

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

    showModal(selectedUser) {
        Modal.show({
            content:<AccountEdit />
        })
    },

	render() {
		return(
			<div>
		        <div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"60px"}}>
		          <div className="col-lg-12">
		            <h2 style={{marginTop:"16px"}}>Contacts</h2>
		          </div>
		        </div>
		        <div className="contacts-page wrapper wrapper-content animated fadeIn">
					<FilterBox2 
						items={this.data.suppliers}
						newItemCallback={this.showModal}
						itemView={{
							summary:Contact2LineWithAvatar,
							detail:AccountFlipWidget
						}}
					/>
				</div>
			</div>
		);
	}
})