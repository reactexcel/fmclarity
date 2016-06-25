import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

// FacilityPageIndex
//
// Uses fmc:filterbox2 to create a layout with the users facilities in a left navigation panel
// and the detail view of the currently selected facility in the right navigation
//
FacilityPageIndex = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {

    	Meteor.subscribe('teamsAndFacilitiesForUser');
    	Meteor.subscribe('facilities');
        Meteor.subscribe('users');
        //
    	var team, facility, client, facilities;

	    team = Session.getSelectedTeam();
	    facility = Session.getSelectedFacility();
	    client = Session.getSelectedClient();

    	if(team) {
			Meteor.subscribe('suppliersForTeam',team._id,team.suppliers?team.suppliers.length:null);

	    	facilities = team.getFacilities();

	        if(client) {
	        	//note that the facilities are being filtered after retreival from db
	        	//this could be employed more widely across the app to improve performance
	        	//on retrieval of non-sensitive data
	        	facilities = _.filter(facilities,function(f){
	        		return (
	        			(f.team._id == client._id)||
	        			(f.team.name == client.name)
	        		)
	        	})
	        }
        }
		return {
		    selectedTeam:team,
		    selectedFacility:facility,
		    facilities:facilities
		}
    },

    // Opens modal with a new facility form in it
    createNew(callback) {
    	this.data.selectedTeam.addFacility(function(response){
    		var newItem = Facilities.findOne(response._id);
    		Modal.show({
            	content:<FacilityViewEdit item={newItem} />
            });
            callback(newItem);
        })
    },

    // Used as a callback to filterbox
    // Causes facility selected in filterbox left nav to be also selected globally
	handleSelect(facility) {
		Session.selectFacility(facility);
	},

	render() {

		var team = this.data.selectedTeam;

		if(!team) {
			return <div/>
		}

		return(		        
			<div className="facility-page">

                {
	                /* contractors can filter facilities by client using this component */
	                team.type=="contractor"?

		                <div className="row wrapper page-heading">
		                    <div className="col-lg-12">
		                        <ClientFilter title="Sites"/>
		                    </div>
		                </div>

	                :null
            	}

                <div className="wrapper wrapper-content animated fadeIn">
                	{/* from fmc:filterbox */}
					<FilterBox2 
						items={this.data.facilities}
						navWidth={3}
						itemView={{
							summary:FacilitySummary,
							detail:FacilityCard
						}}
						newItemCallback={team.canAddFacility()?this.createNew:null}
						onSelect={this.handleSelect}/>
				</div>

			</div>
		);
	}
})