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
		var request,location,areas,subareas,identifiers;
		var request = this.props.context;
		if(request&&request.facility) {
			areas = request.facility.areas;
		}

		location = this.props.value||{};
		if(location.area) {
			subareas = location.area.children;
		}
		if(location.subarea) {
			identifiers = location.subarea.children||location.subarea.identifiers;
		}

		return {
			location:location,
			areas:areas,
			subareas:subareas,
			identifiers:identifiers
		}
	},

	handleChange(attribute,newVal) {
		var location = this.props.value||{};
		location[attribute] = newVal;
		switch(attribute) {
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
		return (
			<div className="row">
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

MDServiceSelector = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		var request,service,subservice,services,subservices;
		request = this.props.context;
		if(request&&request.facility) {
			services = request.facility.servicesRequired;
		}
		console.log(services);

		service = this.props.value||{};
		subservice = service.subservice;
		if(service.children) {
			subservices = service.children;
		}

		return {
			services:services,
			subservices:subservices,
			service:service,
			subservice:subservice,
		}
	},

	updateService

	updateSubservice(newVal) {
		var service = this.props.value||{};
		service.subservice = newVal;
		this.props.onChange(service);
	},

	render() {
		//console.log(this.data);
		console.log(this.data);
		return (
			<div className="row">
				<div className="col-md-6">
					<AutoInput.MDSelect 
						items={this.data.services} 
						disabled={!this.data.services}
						selectedItem={this.data.service}
						itemView={NameCard}
						onChange={this.props.onChange}
						placeholder="Service"
					/>
				</div>
				<div className="col-md-6">
					<AutoInput.MDSelect 
						items={this.data.subservices} 
						disabled={!this.data.subservices}
						selectedItem={this.data.subservice}
						itemView={NameCard}
						onChange={(val)=>{this.updateService(val)}}
						placeholder="Sub-service"
					/>
				</div>
			</div>
		)
	}
})