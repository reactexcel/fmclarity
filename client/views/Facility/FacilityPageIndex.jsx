import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FacilityIndexPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('teamsAndFacilitiesForUser');//for some reason this isn't picking up my contractors
    	Meteor.subscribe('facilities');
        Meteor.subscribe('users');
    	var team, facility, facilties;
    	if(Meteor.user()) {
	        team = Session.getSelectedTeam();
    	    if(team) {
		    	Meteor.subscribe('suppliersForTeam',team._id,team.suppliers?team.suppliers.length:null);
	    	    facility = Session.getSelectedFacility();
	        	facilities = team.getFacilities();
	        	var client = Session.getSelectedClient();
	        	if(client) {
	        		//this is an awesome way to do it
	        		//it needs to be like this on all filter pages
	        		//to avoid the access bypass problems we were having
	        		facilities = _.filter(facilities,function(f){
	        			return (
	        				(f.team._id == client._id)||
	        				(f.team.name == client.name)
	        			)
	        		})
	        	}

		        return {
		        	ready:true,
		        	selectedTeam : team,
		        	selectedFacility : facility,
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
            callback(newItem);
        })
    },

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	handleSelect(facility) {
		Session.selectFacility(facility);
	},

	render() {
		var team = this.data.selectedTeam;
		if(!this.data.ready) return <div/>
		return(		        
			<div className="facility-page">
                {team.type=="contractor"?
                <div className="row wrapper page-heading">
                    <div className="col-lg-12">
                        <ClientFilter title="Sites"/>
                    </div>
                </div>:null}
                <div className="wrapper wrapper-content animated fadeIn">
					<FilterBox2 
						items={this.data.facilities}
						navWidth={3}
						itemView={{
							summary:FacilitySummary,
							detail:FacilityCard
						}}
						newItemCallback={team.canAddFacility()?this.createNew:null}
						onSelect={this.handleSelect}
					/>
				</div>
			</div>
		);
	}
})