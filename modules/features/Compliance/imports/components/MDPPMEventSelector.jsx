import React from 'react';
import ReactDOM from 'react-dom';
import {ReactMeteorData} from 'meteor/react-meteor-data';

MDPPMEventSelector = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		let user, facility, requests;
		user = Meteor.user();
		facility = this.props.options.facility;
		if (facility) {
			({requests} = user.getRequests({ 'facility._id': facility._id, type:'Scheduler' }));
		}
		return {
			requests: requests
		}
	},

	render() {
		return (
			<AutoInput.MDSelect 
				items={this.data.requests} 
				selectedItem={this.props.value}
				itemView={NameCard}
				onChange={this.props.onChange}
				placeholder="PPM Event"
			/>
		)
	}
})
