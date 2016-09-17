import React from 'react';

import { AutoForm } from '/modules/core/AutoForm';
import { Menu } from '/modules/ui/MaterialNavigation';
import { ContactDetails, ContactList } from '/modules/model-mixins/Members';

import { PMPList } from '/modules/plugins/Compliance';

export default function FacilityPanel( props ) {
    let { team, facility } = props;

    function getMenu() {
        let menu = [];

        if ( facility && facility.canSave() ) {
            menu.push( {
                label: "Edit",
                action() {
                    Modal.show( {
                        content: <FacilityViewEdit item={ facility } />
                    } )
                }
            } );
        }

        if ( facility.canDestroy() ) {
            menu.push( {
                label: "Delete",
                action() {
                    facility.destroy();
                }
            } );
        }

        menu.push( {
            label: "Back",
            action() {
                Session.selectFacility( 0 );
            }
        } )
        return menu;
    }

    return (
        <div>
            <div className="facility-card">

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

                                    {facility.address.toString()?
                                    <b>{facility.address.toString()}</b>
                                    :null}

                                </div>
                                <ContactDetails item={facility.contact}/>
                            </div>
                        </div>
                    </div>
                </div>


                <IpsoTabso tabs={[
                    {
                        hide:       !facility.canGetMessages(),
                        tab:        <span id="discussion-tab">Updates</span>,
                        content:    <Inbox for={facility} truncate={true}/>
                    },{
                        hide:       !facility.canAddDocument(),
                        tab:        <span id="documents-tab">Documents</span>,
                        content:    <AutoForm item={facility} form={["documents"]}/>
                    },{
                        hide:       !facility.canAddMember(),
                        tab:        <span id="personnel-tab">Personnel</span>,
                        content:    <ContactList group={facility} filter={{role:{$in:["staff","manager"]}}} defaultRole="staff" team={team}/>
                    },{
                        hide:       !facility.canAddMember(),
                        tab:        <span id="tenants-tab">Tenants</span>,
                        content:    <ContactList group={facility} filter={{role:"tenant"}} defaultRole="tenant" team={team}/>
                    },{
                        hide:       !facility.canSetAreas(),
                        tab:        <span id="areas-tab">Areas</span>,
                        content:    <FacilityAreasSelector item={facility}/>
                    },{
                        hide:       !facility.canSetServicesRequired(),
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
            <ActionsMenu items={getMenu()} />
        </div>
    )
}
