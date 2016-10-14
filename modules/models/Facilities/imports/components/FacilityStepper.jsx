import React from "react";

import { OwnerCard } from '/modules/mixins/Owners';
import { Stepper } from '/modules/ui/Stepper';

import { ThumbView } from '/modules/mixins/Thumbs';

import { Facilities } from '/modules/models/Facilities';

import { AutoForm } from '/modules/core/AutoForm';
import { AreasEditor } from '/modules/mixins/Areas';
import { ContactList } from '/modules/mixins/Members';
import { ServicesRequiredEditor } from '/modules/mixins/Services';

var submitFormCallback = null;

export default function FacilityStepper( { item } ) {

    let facility = item;

	function setThumb( thumb ) {
		if ( facility ) {
			facility.setThumb( thumb );
			facility.thumb = thumb;
		}
	}

  function onNext( callback, errors ){
    submitFormCallback = callback;
  }

	/*
	if ( !facility && facility.canCreate() ) {
		//show facility creation information
	} else if ( !facility.canSave() ) {
		return (
			<FacilityViewDetail item={facility} />
		)
	}
	*/
	return (
		<div className="ibox-form user-profile-card" style={{backgroundColor:"#fff"}}>
			    <h2 style={{marginTop:"0px"}}>Edit facility</h2>
                {facility.owner?<div>
                    <b>Facility owner:</b>
                    <OwnerCard item={facility}/>
                </div>
                :
                null
                }
                <Stepper
                  submitForm = { ( callback ) => {
                    if( submitFormCallback ){
                      submitFormCallback( callback );
                    }
                  }
                }
                   tabs={[
                	{
                    	tab: 		<span id="discussion-tab">Basic Details</span>,
                    	content: 	<div className="row">
										<div className = "col-sm-7">
                                            <AutoForm
                                                model   = { Facilities }
                                                item    = { facility }
                                                form    = { ["name", "type", "address", "operatingTimes" ] }
                                                onNext = { onNext }
                                                hideSubmit = { true }
                                                submitFormOnStepperNext = { true }
                                              />
                                        </div>
					        			<div className = "col-sm-5">
                                            <ThumbView item = { facility.thumb } onChange = { setThumb } />
                                        </div>
			        				</div>,
			        	guide: 		<div>Enter the basic facility info here including name, address, and image.</div>
                    },{
                        tab: 		<span id = "areas-tab"><span>Areas</span></span>,
                        content: 	<AreasEditor item = { facility }/>
                    },{
                        tab: 		<span id = "services-tab">Services</span>,
                        content: 	<ServicesRequiredEditor item = { facility } field = { "servicesRequired" }/>,
			        	guide: 		<div>Enter the services required by this facility. If you want you can also match there services to a supplier. If you want to configure this later simply his finish.</div>
                    },{
                        tab: 		<span id="personnel-tab">Personnel</span>,
                        content: 	<ContactList group = { facility } filter = { {role: {$in: ["staff", "manager"] } } } defaultRole="staff" team={facility.team}/>,
			        	guide: 		<div>Enter the facility personnel here by clicking on add member.</div>
                    },{
                        tab: 		<span id="tenants-tab">Tenants</span>,
                        content: 	<ContactList group={facility} filter={{role:"tenant"}} defaultRole="tenant" team={facility.team}/>,
			        	guide: 		<div>Enter tenants to the property by clicking on add member here.</div>
                    },{
                        tab: 		<span id="documents-tab">Documents</span>,
                        content: 	<AutoForm model = { Facilities } item = { facility } form = { ["documents"] } />,
			        	guide: 		<div>Formal documentation related to the facility can be added here. This typically includes insurance and/or lease documents.</div>
                    }/*,{
                        tab:        <span id="requests-tab">Plugins</span>,
                        content:    <FacilityPluginSelector/>
                    },{
                        tab: 		<span id="suppliers-tab"><span>Suppliers</span></span>,
                        content: 	<ContactList members={suppliers} group={facility} type="team"/>,
			        	guide: 		<div>Add the suppliers employed by this facility here. If you want to configure this later simply press next.</div>
                    },*/
                ]}/>
			</div>
	)
}
