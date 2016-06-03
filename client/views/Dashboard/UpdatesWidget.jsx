import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

UpdatesWidget = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var user,item,team,facility;
    	user = Meteor.user();
    	if(this.props.item) {
    		item = this.props.item;
    	}
    	else if(user) {
    		facility = user.getSelectedFacility();
	    	team = user.getSelectedTeam();

    		if(facility) {
	    		Meteor.subscribe("messages","Facilities",facility._id,moment().subtract({days:7}).toDate())
	    		item = facility;
    		}
    		else if(team) {
	    		Meteor.subscribe("messages","Teams",team._id,moment().subtract({days:7}).toDate())
		    	item = team;
	    	}
	    	else {
	    		Meteor.subscribe("messages","users",user._id,moment().subtract({days:7}).toDate())
		    	item = user;	    		
	    	}
    	}
    	return {
    		user:user,
    		item:item
    	}
    },

	render() {
	    return (
	    	<div>
		        {/*<ActionsMenu items={this.getMenu()} icon="eye" />*/}
		        <div className="ibox-title">
		        	<h2>Recent Updates</h2>
		        </div>
		        <div className="ibox-content">
		        	{this.data.item?
					<Inbox for={this.data.item} truncate={true}/>
		        	:null}
				</div>
			</div>
	    )
	}
})