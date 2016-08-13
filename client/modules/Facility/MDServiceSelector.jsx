import React from 'react';
import ReactDOM from 'react-dom';
import {ReactMeteorData} from 'meteor/react-meteor-data';

MDServiceSelector = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		var request,service,subservice,services,subservices;
		request = this.props.context;
		if(request&&request.facility) {
			services = request.facility.servicesRequired;
		}
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

	updateSubService(newVal) {
		var service = this.props.value||{};
		service.subservice = newVal;
		this.props.onChange(service);
	},

	render() {
		var shouldIncludeFacilitySelector = this.props.options.shouldIncludeFacilitySelector;
		return (
			<div className="row">
				{
					shouldIncludeFacilitySelector?
						<div className="col-md-12">
							<MDFacilitySelector onChange={this.facilitySelected}/>
						</div>
					:
						null
				}
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
						onChange={this.updateSubService}
						placeholder="Sub-service"
					/>
				</div>
			</div>
		)
	}
})