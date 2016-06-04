import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FacilityViewDetail = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var team,facility,members,suppliers;
        team = Session.getSelectedTeam();
        facility = this.props.item;
        if(facility) {
            Meteor.subscribe("messages","Facilities",facility._id,moment().subtract({days:7}).toDate());
            members = facility.getMembers();
            suppliers = team.getSuppliers({facility});
        }
        return {
            facility:facility,
            suppliers:suppliers,
            members:members,
            team:team
        }
    },

    saveFacility() {
        Meteor.call("Facility.save",this.data.facility);
    },

    addMember(ext,member) {
        this.data.facility.addMember(member,ext);
    },

    addSupplier(ext,supplier) {
        this.data.facility.addSupplier(supplier,ext);
    },

    updateField(field) {
        var component = this;
        return function(event) {
            component.data.facility[field] = event.target.value;
            component.saveFacility();
        }
    },

    render() {
        var facility = this.data.facility;
        var members = this.data.members;
        var suppliers = this.data.suppliers;
        var team = this.data.team;
        var thumb = facility.getThumbUrl();
        var createdAt = moment(facility.createdAt).format();
        var contact = facility.getPrimaryContact();
        if(contact) {
            contactName = contact.getName();
            contact = contact.getProfile();
        }
        return (
            <div className="facility-card">

                <div className="contact-thumbnail">
                    {thumb?
                    <div style={{backgroundImage:"url('"+facility.getThumbUrl()+"')"}}>
                        <img alt="image" src={thumb}/>
                    </div>
                    :null}
                </div>

                <div className="title-overlay">
                    <h2>{facility.getName()}</h2>                        
                    <b>{facility.getAddress()}</b>
                </div>

                {contact?

                     <div className="contact-info">
                        {contactName?<span className="contact-title">Contact: {contactName}<br/></span>:null}
                        <span><i className="fa fa-envelope"></i> {contact.email}<br/></span>
                        {contact.phone?<span><i className="fa fa-phone"></i> {contact.phone}<br/></span>:null}
                        {contact.phone2?<span><i className="fa fa-phone"></i> {contact.phone2}<br/></span>:null}
                    </div>

                :null}

                <IpsoTabso tabs={[
                    {
                        tab:<span id="discussion-tab"><span style={{color:"white"}}>Updates</span></span>,
                        content:<div style={{maxHeight:"600px",overflowY:"auto"}}>
                            <Inbox for={facility} truncate={true}/>
                        </div>
                    },
                    {
                        tab:<span id="documents-tab"><span style={{color:"white"}}>Documents</span></span>,
                        content:<div>
                            <AutoForm item={facility} schema={Facilities.schema()} form={["documents"]}/>
                        </div>
                    },
                    {
                        tab:<span id="personnel-tab"><span style={{color:"white"}}>Personnel</span></span>,
                        content:<div style={{maxHeight:"600px",overflowY:"auto"}}>
                            <ContactList 
                                items={members}
                                facility={facility}
                                onAdd={team&&team.canInviteMember()?this.addMember.bind(null,{role:"staff"}):null}
                            />
                        </div>
                    },
                    {
                        tab:<span id="suppliers-tab"><span style={{color:"white"}}>Suppliers</span></span>,
                        content:<div style={{maxHeight:"600px",overflowY:"auto"}}>
                            <ContactList 
                                items={suppliers}
                                facility={facility}
                                type="team"
                                onAdd={team&&team.canInviteSupplier()?this.addSupplier.bind(null,{role:"supplier"}):null}
                            />
                        </div>
                    },
                    {
                        tab:<span id="services-tab"><span style={{color:"white"}}>Services</span></span>,
                        content:<div style={{maxHeight:"600px",overflowY:"auto"}}>
                            <ServicesSelector item={facility} field={"servicesRequired"}/>
                        </div>
                    }
                ]} />                
            </div>
        )}
})
