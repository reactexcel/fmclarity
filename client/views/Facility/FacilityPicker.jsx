import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FacilityPicker = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var data={};
    	data.user = Meteor.user();
    	data.team = Session.getSelectedTeam();
    	data.facility = Session.getSelectedFacility();
    	if(data.team) {
    		data.facilities = data.team.getFacilities();
    	}
		return data;
	},

	render() {
		if(!this.data.user) {
			return <div/>
		}
		var facilities = this.data.facilities;
		var facility = this.data.facility;
		return (
			<AutoInput.MDSelect placeholder="Facility" onChange={this.props.onChange} items={facilities} itemView={NameCard} value={facility}/>
		)
	}

})

TeamPicker = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
    	var data={};
    	data.user = Meteor.user();
    	data.team = Session.getSelectedTeam();
    	if(data.user) {
    		data.teams = data.user.getTeams();
    	}
		return data;
	},

	render() {
		if(!this.data.user) {
			return <div/>
		}
		var teams = this.data.teams;
		var team = this.data.team;
		return (
			<AutoInput.MDSelect placeholder="Team" onChange={this.props.onChange} items={teams} itemView={NameCard} value={team}/>
		)
	}
})

ServicePicker = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
    	var data={};
    	data.facility = Session.getSelectedFacility();
    	if(data.facility) {
    		data.services = data.facility.getServices();
    	}
		return data;
	},

	render() {
		var services = this.data.services;
		if(!services||!services.length) {
			return <div/>
		}
		return (
			<AutoInput.MDSelect placeholder="Service" onChange={this.props.onChange} items={services} itemView={NameCard} value={this.props.value}/>
		)
	}

})