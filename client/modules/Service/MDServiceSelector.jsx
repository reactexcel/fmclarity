import React from 'react';
import ReactDOM from 'react-dom';
import {ReactMeteorData} from 'meteor/react-meteor-data';

MDServiceSelector = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {

		let request = this.props.context,
			facility = null,
			service = this.props.value,
			subservice = null,
			services = null,
			subservices = null;

		if(request) {
			if( request.facility && request.facility._id ) {
				facility = Facilities.findOne(request.facility._id);
				services = facility.servicesRequired;
			}
			if(request.subservice) {
				subservice = request.subservice;
			}
		} 

		if(service && service.children) {
			subservices = service.children;
		}

		return {
			service:service,
			services:services,
			subservice:subservice,
			subservices:subservices,
		}
	},

	updateService(newService) {
		let update = {
			service: newService,
			subservice: null
		}
		if(newService.data&&newService.data.supplier) {
			update.supplier = Teams.findOne(newService.data.supplier._id);
		}
		if(this.props.multiChange) {
			this.props.multiChange(update);
		}
	},

	updateSubService(newSubService) {
		let update = {
			subservice: newSubService
		}
		if(newSubService.data&&newSubService.data.supplier) {
			update.supplier = Teams.findOne(newSubService.data.supplier._id);
		}
		if(this.props.multiChange) {
			this.props.multiChange(update);
		}
	},

	render() {
		var shouldIncludeFacilitySelector = this.props.options.shouldIncludeFacilitySelector;
		return (
			<div className="row">
				<div className="col-md-6">
					<AutoInput.MDSelect 
						items={this.data.services} 
						disabled={!this.data.services}
						selectedItem={this.data.service}
						itemView={NameCard}
						onChange={this.updateService}
						placeholder="Service"
					/>
				</div>
				<div className="col-md-6">
					<AutoInput.MDSelect 
						items={this.data.subservices} 
						disabled={!this.data.subservices}
						selectedItem={this.data.subservice}
						itemView={NameCard}
						onChange={this.updateSubService}
						placeholder="Sub-service"
					/>
				</div>
			</div>
		)
	}
})