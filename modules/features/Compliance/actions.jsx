import React from 'react';
import { Modal } from '/modules/ui/Modal';
import { AutoForm } from '/modules/core/AutoForm';
import { Action } from '/modules/core/Actions';
import ComplianceRuleSchema from './imports/models/ComplianceRuleSchema.jsx';

const createRule = new Action( {
    name: 'create compliance rule',
    label: "Create compliance rule",
    action: ( ) => {
        Modal.show({
            content: <AutoForm
                item = { { facility: Session.getSelectedFacility() } }
                form = { ComplianceRuleSchema }
                onSubmit = { createNewComplianceRule }
            />
        })
    }
} )


function createNewComplianceRule( newRule ) {
    console.log( newRule );
    var facility = newRule.facility;
    if (facility) {
        var services = facility.servicesRequired;
        console.log( services );
        //get index of the selected service
        var idx = -1;
        for (var i in services) {
            if (services[i].name == newRule.service.name) {
                idx = i;
                break;
            }
        }
        if (idx >= 0) {
            var service = services[idx];
            //console.log( { service, idx } );
            if (!service.data) {
                service.data = {};
            }
            if (!service.data.complianceRules) {
                service.data.complianceRules = [];
            }
            //to avoid circular search remove facility and then add with just name and _id
            var copy = _.omit(newRule, 'facility', 'service' /*,'event'*/ );
            if (newRule.facility) {
                copy.facility = _.pick(newRule.facility, 'name', '_id');
            }
            /*if(newRule.event) {
            	copy.event = _.pick(newRule.event,'name','_id');
            }*/
            if (newRule.service) {
                copy.service = _.pick(newRule.service, 'name');
            }
            service.data.complianceRules.push(copy);
            services[idx] = service;
        }
        facility.setServicesRequired(services);
    }
    Modal.hide();
}

export {
    createRule
}