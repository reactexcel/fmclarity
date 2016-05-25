import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

DocsPageIndex = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('docs');
	    var docs;
    	if(Meteor.user()) {
	        var team = Meteor.user().getSelectedTeam();
	        if(team) {
		        var facility = Session.getSelectedFacility();
		        var q;
		        if(facility) {
		        	q = {'facility._id':facility._id};
		        }
	        	docs = team.getDocs(q);
	        	console.log(docs);
	        }
	    }
        return {
            docs : docs
        }
    },

    createNew(callback) {
        var selectedFacility = Meteor.user().getSelectedFacility();
        var selectedTeam = Session.getSelectedTeam();
        var issue = {
        	costThreshold:selectedTeam.defaultWorkOrderValue
        }
        if(selectedTeam) {
    		issue.team = {
    			_id:selectedTeam._id,
	    		name:selectedTeam.name
	    	}
        }
        if(selectedFacility) {
	    	issue.facility = {
	    		_id:selectedFacility._id,
	    		name:selectedFacility.name
	    	}
	    }
	    Meteor.call('Issues.create',issue,function(err,response){
	    	if(err) {
	    		console.log(err);
	    	}
	    	if(callback&&response) {
	    		var newItem = Issues.findOne(response._id);
	    		callback(newItem);
	    	}
	    });
	    //Issues.create(issue,callback);
    },

	render() {
		return(
			<div>
		        <div className="row wrapper page-heading">
		          <div className="col-lg-12">
                    <FacilityFilter title="Requests"/>
		          </div>
		        </div>
		    	{/*newItemCallback could be a collection helper - then we pass in the collection to the filterbox*/}
		        <div className="issue-page wrapper wrapper-content animated fadeIn">
					<FilterBox 
						items={this.data.docs}
						itemView={{
							summary:DocViewItem,
							detail:DocViewEdit
						}}
					/>
				</div>
			</div>
		);
	}
})