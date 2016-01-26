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

    showModal(selectedUser) {
        Modal.show({
            content:<TeamViewEdit />
        })
    },

	render() {
		return(
	        <div className="contacts-page wrapper wrapper-content animated fadeIn">
				<FilterBox2 
					items={this.data.suppliers}
					newItemCallback={this.showModal}
					itemView={{
						summary:Contact2LineWithAvatar,
						detail:TeamCard
					}}
				/>
			</div>
		);
	}
})