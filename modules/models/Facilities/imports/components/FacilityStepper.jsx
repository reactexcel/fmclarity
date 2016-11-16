import React from "react";
import ReactDOM from 'react-dom';

import { OwnerCard } from '/modules/mixins/Owners';
import { Stepper } from '/modules/ui/Stepper';

import { ThumbView } from '/modules/mixins/Thumbs';

import { Facilities } from '/modules/models/Facilities';

import { AutoForm } from '/modules/core/AutoForm';
import { AreasEditor } from '/modules/mixins/Areas';
import { ContactList } from '/modules/mixins/Members';
import { ServicesRequiredEditor } from '/modules/mixins/Services';
import { GeoLocation } from '/modules/ui/AddressPicker';

var submitFormCallback = null;

export default function FacilityStepper( { item, onSaveFacility } ) {

    let facility = item;

    function setThumb( thumb ) {
        if ( facility ) {
            facility.setThumb( thumb );
            facility.thumb = thumb;
        }
    }

    function onNext( callback, errors ) {
        submitFormCallback = callback;
    }

    function onSuggestSelect( suggest ) {
        var componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'long_name',
            postal_code: 'short_name',
            establishment: 'short_name',
            premise: 'short_name'
        };
        var place = suggest.gmaps;
        console.log( place );
        var val = "";
        let street_number, city, state, country, pcode, street_name = "";
        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        var loctype = place.address_components[ 0 ].types[ 0 ];
        var locname = place.address_components[ 0 ][ componentForm[ loctype ] ];
        for ( var i = 0; i < place.address_components.length; i++ ) {
            var addressType = place.address_components[ i ].types[ 0 ];
            console.log( addressType );
            if ( componentForm[ addressType ] ) {
                val = place.address_components[ i ][ componentForm[ addressType ] ];
            }
            if ( facility ) {

                switch ( addressType ) {

                    case "street_number":
                        street_number = val;
                        break;
                    case "route":
                        street_name = val;
                        break;
                    case "locality":
                        city = val;
                        break;
                    case "administrative_area_level_1":
                        state = val;
                        break;
                    case "country":
                        country = val;
                        break;
                    case "postal_code":
                        pcode = val;
                        break;
                    default:

                }
            };
        }
        facility.address.streetNumber = street_number;
        facility.address.city = city;
        facility.address.state = state;
        facility.address.country = country;
        facility.address.postcode = pcode;
        facility.address.streetName = street_name;
        facility.name = locname;


        ReactDOM.render( <AutoForm model = { Facilities } item = { facility } form = { ["name", "type", "address", "operatingTimes" ] } onNext = { onNext } hideSubmit = { true } submitFormOnStepperNext = { true }/>, document.getElementById( 'address_area' ) );
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

                { facility.owner ?
                <div>
                    <b>Facility owner:</b>
                    <OwnerCard item = { facility }/>
                </div>
                : null }

                <Stepper

                    submitForm = { ( callback ) => {
                        if( submitFormCallback ){
                            submitFormCallback( callback );
                        }
                    } }

                    onFinish = { () => {
                      //Select the new created facility.
                        if ( onSaveFacility ){
                          onSaveFacility( facility );
                        } else {
                          Session.selectFacility( facility );
                        }
                      }
                    }

                   tabs={[
                    {
                        tab:        <span id="discussion-tab">Basic Details</span>,
                        content:    <div className="row">
                                        <div className = "col-sm-7">
                                        
                                        <GeoLocation
                                            onSuggestSelect = {onSuggestSelect}
                                        />
                                        <div id="address_area">
                                            <AutoForm
                                                model       = { Facilities }
                                                item        = { facility }
                                                form        = { ["name", "type", "address", "operatingTimes" ] }
                                                onNext      = { onNext }
                                                hideSubmit  = { true }
                                                submitFormOnStepperNext = { true }
                                              />
                                        </div>
                                        </div>
                                        <div className = "col-sm-5">
                                            <ThumbView item = { facility.thumb } onChange = { setThumb } />
                                        </div>
                                    </div>,
                        guide:      <div>Enter the basic facility info here including name, address, and image.</div>
                    },{
                        tab:        <span id = "areas-tab"><span>Areas</span></span>,
                        content:    <AreasEditor item = { facility }/>
                    },{
                        tab:        <span id = "services-tab">Services</span>,
                        content:    <ServicesRequiredEditor item = { facility } field = { "servicesRequired" }/>,
                        guide:      <div>Enter the services required by this facility. If you want you can also match the services to a supplier. If you want to configure this later simply hit finish.</div>
                    },{
                        tab:        <span id="personnel-tab">Personnel</span>,
                        content:    <ContactList group = { facility } filter = { {role: {$in: ["staff", "manager"] } } } defaultRole="staff" team={facility.team}/>,
                        guide:      <div>Enter the facility personnel here by clicking on add member.</div>
                    },{
                        tab:        <span id="tenants-tab">Tenants</span>,
                        content:    <ContactList group={facility} filter={{role:"tenant"}} defaultRole="tenant" team={facility.team}/>,
                        guide:      <div>Enter tenants to the property by clicking on add member here.</div>
                    },{
                        tab:        <span id="documents-tab">Documents</span>,
                        content:    <AutoForm model = { Facilities } item = { facility } form = { ["documents"] } hideSubmit = { true } />,
                        guide:      <div>Formal documentation related to the facility can be added here. This typically includes insurance and/or lease documents.</div>
                    }/*,{
                        tab:        <span id="requests-tab">Plugins</span>,
                        content:    <FacilityPluginSelector/>
                    },{
                        tab:        <span id="suppliers-tab"><span>Suppliers</span></span>,
                        content:    <ContactList members={suppliers} group={facility} type="team"/>,
                        guide:      <div>Add the suppliers employed by this facility here. If you want to configure this later simply press next.</div>
                    },*/
                ]}/>
            </div>
    )
}
