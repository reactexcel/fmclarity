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
				itemView={NameCard}
				onChange={this.props.onChange}
				placeholder="Facility"
			/>
		)
	}
})

MDLocationSelector = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		var location,facilities,facility,areas,subareas,identifiers;
		location = this.props.value||{};

		facilities = Meteor.user().getFacilities();
		if(location.facility&&location.facility._id) {
			facility = Facilities.findOne(location.facility._id);
			if(facility) {
				areas = facility.areas;
			}
		}
		if(location.area) {
			subareas = location.area.children;
		}
		if(location.subarea) {
			identifiers = location.subarea.children||location.subarea.identifiers;
		}

		return {
			facility:facility,
			location:location,
			facilities:facilities,
			areas:areas,
			subareas:subareas,
			identifiers:identifiers
		}
	},

	handleChange(attribute,newVal) {
		var location = this.props.value||{};
		location[attribute] = newVal;
		switch(attribute) {
			case "facility":
				location.area = null;
			case "area":
				location.subarea = null;
			case "subarea":
				location.identifier = null;
			break;
		}
		this.props.onChange(location);
	},

	render() {
		//console.log(this.data);
		console.log(this.props.context);
		return (
			<div className="row">
				<div className="col-md-12">
					<AutoInput.MDSelect 
						items={this.data.facilities} 
						selectedItem={this.data.facility}
						itemView={NameCard}
						onChange={this.handleChange.bind(this,"facility")}
						placeholder="Facility"
					/>
				</div>
				<div className="col-md-4">
					<AutoInput.MDSelect 
						items={this.data.areas} 
						disabled={!this.data.areas}
						selectedItem={this.data.location.area}
						itemView={NameCard}
						onChange={this.handleChange.bind(this,"area")}
						placeholder="Area"
					/>
				</div>
				<div className="col-md-4">
					<AutoInput.MDSelect 
						items={this.data.subareas} 
						disabled={!this.data.subareas}
						selectedItem={this.data.location.subarea}
						itemView={NameCard}
						onChange={this.handleChange.bind(this,"subarea")}
						placeholder="Sub-area"
					/>
				</div>
				<div className="col-md-4">
					<AutoInput.MDSelect 
						items={this.data.identifiers} 
						disabled={!this.data.identifiers}
						selectedItem={this.data.location.identifier}
						itemView={NameCard}
						onChange={this.handleChange.bind(this,"identifier")}
						placeholder="Identifier"
					/>
				</div>
			</div>
		)
	}
})