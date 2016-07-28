import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

ServiceViewDetail = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var data = {};
        data.facility = Session.getSelectedFacility();
        data.team = Session.getSelectedTeam();
        data.suppliers = data.facility.getSuppliers();
        return data;
    },

    render() {

        var facility = this.data.facility;
        var team = this.data.team;
        var suppliers = this.data.suppliers;
        var service = this.props.item;

        console.log(service);

        var thumb = "img/services/"+service.name+".jpg";
        var address;

        var thumb, createdAt, contact, contactName;
        if(facility) {
            createdAt = moment(facility.createdAt).format();
            contact = facility.getPrimaryContact();
            if(contact) {
                contactName = contact.getName();
                contact = contact.getProfile();
            }
        }

        //IpsoTabs content needs slimscroll applied
        //IpsoTabs should be renamed... TabPanel?
        return (
            <div className="facility-card">

                <div className="contact-thumbnail">
                    {thumb?
                    <div style={{backgroundImage:"url('"+thumb+"')"}}>
                        <img alt="image" src={thumb}/>
                    </div>
                    :null}
                </div>

                <div className="title-overlay">
                    <h2>{service.name}</h2>
                    {address?<b>{address}</b>:null}
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
                        tab:        <span id="discussion-tab"><span style={{color:"white"}}>Contracts</span></span>,
                        content:    <AutoForm item={facility} form={["documents"]}/>
                    },{
                        tab:        <span id="documents-tab"><span style={{color:"white"}}>Reactive</span></span>,
                        content:    <AutoForm item={facility} form={["documents"]}/>
                    },{
                        tab:        <span id="personnel-tab"><span style={{color:"white"}}>Preventative</span></span>,
                        content:    <ContactList group={facility} filter={{role:{$in:["staff","manager"]}}} defaultRole="staff" team={team}/>
                    },{
                        tab:        <span id="tenants-tab"><span style={{color:"white"}}>Compliance</span></span>,
                        content:    <ContactList group={facility} filter={{role:"tenant"}} defaultRole="tenant" team={team}/>
                    },{
                        tab:        <span id="tenants-tab"><span style={{color:"white"}}>Live</span></span>,
                        content:    <ContactList group={facility} filter={{role:"tenant"}} defaultRole="tenant" team={team}/>
                    }
                ]} />                
            </div>
        )}
})
