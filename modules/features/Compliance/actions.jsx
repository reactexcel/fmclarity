import React from 'react';
import { Modal } from '/modules/ui/Modal';
import { AutoForm } from '/modules/core/AutoForm';
import { Action } from '/modules/core/Actions';
import ComplianceRuleSchema from './imports/models/ComplianceRuleSchema.jsx';

const createRule = new Action( {
    name: 'create compliance rule',
    label: "Create compliance rule",
    action: () => {
        Modal.show( {
            content: <AutoForm
                item = { { facility: Session.getSelectedFacility() } }
                form = { ComplianceRuleSchema }
                onSubmit = { createNewComplianceRule }
            />
        } )
    }
} )


function createNewComplianceRule( newRule ) {
  // console.log(newRule,"new Rule");
    if( newRule.document ){
        newRule.docType = newRule.document.type;
        newRule.docName = newRule.document.name;
        var query = JSON.stringify(newRule.document.query);
        newRule.document.query = query;
    }
    var facility = newRule.facility;
    if ( facility ) {
        var services = facility.servicesRequired;
        services =  _.filter(services, service => service != null);
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
            // start-- check for sub service -----
            let isSubService = false;
            let subservices = [];
            let subserviceId = -1;
            if( service.children && service.children.length > 0 ){
                subservices = service.children;
            }
            if( subservices.length > 0 && newRule.subservice && newRule.subservice && newRule.subservice.name ){
                for ( var k in subservices ) {
                    if ( subservices[ k ].name == newRule.subservice.name ) {
                        subserviceId = k;
                        break;
                    }
                }
                if( subserviceId != -1 ){
                    isSubService = subservices[subserviceId];
                }
            }
            // end-- check for sub service -----

            //console.log( { service, idx } );
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

            if( isSubService == false ){   // existing code of adding in service
                service.data.complianceRules.push( copy );
            }else{
                service.children[subserviceId].data.complianceRules.push( copy )
            }
            services[ idx ] = service;
        }
        facility.setServicesRequired( services );
    }
    Modal.hide();
}

export {
    createRule
}
