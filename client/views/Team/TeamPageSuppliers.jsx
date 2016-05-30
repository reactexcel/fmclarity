import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

SupplierIndexPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('contractors');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        var team, suppliers;
        team = Session.getSelectedTeam();
        facility = Session.getSelectedFacility();
        //this needs to be changed so that it always goes through team.getSuppliers
        // ie team.getSuppliers({facility._id}) ergh or something
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
        if(!team) {
            return <div/>
        }
		return(
            <div>
                {team.type=="fm"?
                <div className="row wrapper page-heading">
                    <div className="col-lg-12">
                        <FacilityFilter title="Suppliers"/>
                    </div>
                </div>:null}
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