import React from 'react';
import ReactDOM from 'react-dom';
import {ReactMeteorData} from 'meteor/react-meteor-data';

MDFacilitySelector = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		return {
			facilities:Meteor.user().getFacilities(),
		}
	},

	render() {
		return (
			<AutoInput.MDSelect 
				items={this.data.facilities} 
				selectedItem={this.props.value}
				itemView={FacilitySummary}
				onChange={this.props.onChange}
				placeholder="Facility"
			/>
		)
	}
})