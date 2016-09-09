import React from 'react';
import { Menu } from 'meteor/fmc:material-navigation';
import { ContactDetails, ContactList } from 'meteor/fmc:doc-members';
import { AutoForm } from 'meteor/fmc:autoform';
import FacilityStepper from './FacilityStepper.jsx';

import '/client/modules/Compliance/PMPList.jsx';

import * as Actions from './actions/FacilityActions';

export default function FacilityPanel( { facility } ) {

    function getMenu() {
        return [
            Actions.viewFacility( facility ),
            Actions.editFacility( facility ),
            Actions.deleteFacility( facility )
        ]
    }

    return (
        <div>
            <div className="facility-card">

                {/* standfirst, banner??? */}
                <div className="contact-thumbnail">

                    {facility.thumbUrl?
                    <div className="cover-image" style={{backgroundImage:"url('"+facility.thumbUrl+"')"}}></div>
                    :null}

                    <div className="title-overlay">
                        <div className="row">
                            <div className="col-md-4">
                                <div 
                                    className="facility-title" 
                                    style={{borderBottom:facility.contact?"1px solid #fff":"none"}}>

                                    <h2>{facility.name}</h2>                        

                                    {facility.address?
                                    <b>{facility.getAddress()}</b>
                                    :null}

                                </div>
                                <ContactDetails item={facility.contact}/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* tabs - this it the part that can be data driven using autoform */}
                <IpsoTabso tabs={[
                    {
                        //hide:       !facility.canGetMessages(),
                        tab:        <span id="discussion-tab">Updates</span>,
                        content:    <Inbox for = { facility } truncate = { true }/>
                    },{
                        //hide:       !facility.canAddDocument(),
                        tab:        <span id="documents-tab">Documents</span>,
                        content:    <AutoForm model = { Facilities } item = { facility } form = { ["documents"] }/>
                    },{
                        //hide:       !facility.canAddMember(),
                        tab:        <span id="personnel-tab">Personnel</span>,
                        content:    <ContactList group={facility} filter={{role:{$in:["staff","manager"]}}} defaultRole="staff" team={facility.team}/>
                    },{
                        //hide:       !facility.canAddMember(),
                        tab:        <span id="tenants-tab">Tenants</span>,
                        content:    <ContactList group={facility} filter={{role:"tenant"}} defaultRole="tenant" team={facility.team}/>
                    },{
                        //hide:       !facility.canSetAreas(),
                        tab:        <span id="areas-tab">Areas</span>,
                        content:    <FacilityAreasSelector item={facility}/>
                    },{
                        //hide:       !facility.canSetServicesRequired(),
                        tab:        <span id="services-tab">Services</span>,
                        content:    <ServicesSelector item={facility} field={"servicesRequired"}/>
                    },{
                        tab:        <span id="pmp-tab">PMP</span>,
                        content:    <PMPList filter={{"facility._id":facility._id}}/>
                    },{
                        tab:        <span id="requests-tab">Requests</span>,
                        content:    <RequestsTable filter={{"facility._id":facility._id}}/>
                    }
                ]} />                
            </div>
            <Menu items={getMenu()} />
        </div>
    )
}
