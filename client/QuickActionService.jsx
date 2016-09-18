import React from 'react';

import { AutoForm } from '/modules/core/AutoForm';
import { FacilityStepper } from '/modules/models/Facilities';
import { RequestPanel, CreateRequestForm } from '/modules/models/Requests';
import { Modal } from '/modules/ui/Modal';

export default QuickActions = new function QuickActionService() {

	function createNewComplianceRule( newRule ) {
		var facility = newRule.facility;
		if ( facility ) {
			var services = facility.servicesRequired;
			//get index of the selected service
			var idx = -1;
			for ( var i in services ) {
				if ( services[ i ].name == newRule.service.name ) {
					idx = i;
					break;
				}
			}
			if ( idx >= 0 ) {
				var service = services[ idx ];
				console.log( {
					service,
					idx
				} );
				if ( !service.data ) {
					service.data = {};
				}
				if ( !service.data.complianceRules ) {
					service.data.complianceRules = [];
				}
				//to avoid circular search remove facility and then add with just name and _id
				var copy = _.omit( newRule, 'facility', 'service' /*,'event'*/ );
				if ( newRule.facility ) {
					copy.facility = _.pick( newRule.facility, 'name', '_id' );
				}
				/*if(newRule.event) {
					copy.event = _.pick(newRule.event,'name','_id');
				}*/
				if ( newRule.service ) {
					copy.service = _.pick( newRule.service, 'name' );
				}
				service.data.complianceRules.push( copy );
				services[ idx ] = service;
			}
			facility.setServicesRequired( services );
		}
		Modal.hide();
	}

	function createComplianceRule() {
		Modal.show( {
			content: <AutoForm
				item = { { facility: Session.getSelectedFacility() } }
				form = { ComplianceRuleSchema }
				onSubmit = { createNewComplianceRule }
			/>
		} )
	}

	return {
		createComplianceRule
	}
}
