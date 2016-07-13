import React from "react";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FloatingActionButton = class FloatingActionButton extends React.Component {

	createNewRequest() {

	}

	componentDidMount() {
		$('.fab-panel button[rel=tooltip]').tooltip({
			container: 'body'
		});
	}

    createNewRequest() {
        var selectedFacility = Session.getSelectedFacility();
        var selectedTeam = Session.getSelectedTeam();
        var request = {
        	costThreshold:selectedTeam.defaultWorkOrderValue
        }
        if(selectedTeam) {
    		request.team = {
    			_id:selectedTeam._id,
	    		name:selectedTeam.name
	    	}
        }
        if(selectedFacility) {
	    	request.facility = {
	    		_id:selectedFacility._id,
	    		name:selectedFacility.name
	    	}
	    }
	    //console.log(request);
	    Meteor.call('Issues.create',request,function(err,response){
	    	if(err) {
	    		console.log(err);
	    	}
	    	if(response) {
	    		var newRequest = Issues.findOne(response._id);
	    		//console.log(newRequest);
				Modal.show({
		    		content:<IssueDetail item={newRequest}/>,
		            size:"large"
		    	})
    		}
	    });
		//newItemCallback={team&&team.type=="fm"?this.createNewIssue:null}
	    //Issues.create(request,callback);
    }

    createNewFacility() {
    	var selectedTeam = Session.getSelectedTeam();
    	selectedTeam.addFacility(function(response){
    		var newItem = Facilities.findOne(response._id);
    		Modal.show({
            	content:<FacilityViewEdit item={newItem} />
            });
        })
    }    

	render() {
		return (
			<div className="fab-panel">
				<button 
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new work request"
					onClick={this.createNewRequest} 
					className="fab fab-1">
						+
				</button>
				<button 
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new facility"
					onClick={this.createNewFacility} 
					className="fab fab-2">
						<i className="fa fa-building"></i>
				</button>				
			</div>
		)
	}	
}


