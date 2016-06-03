import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FacilityViewDetail = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var facility = this.props.item;
        if(facility) {
            Meteor.subscribe("messages","Facilities",facility._id,moment().subtract({days:7}).toDate());
        }
        return {
            facility:facility
        }
    },

    saveFacility() {
        Meteor.call("Facility.save",this.data.facility);
    },

    updateField(field) {
        var $this = this;
        return function(event) {
            $this.data.facility[field] = event.target.value;
            $this.saveFacility();
        }
    },


    render() {
        var $this = this;
        var facility = this.data.facility;
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
                    <img alt="image" src={thumb} />
                    :null}
                    {/*<div style={{width:"100%",minHeight:"230px",backgroundImage:"url('"+facility.getThumbUrl()+"')",backgroundSize:"cover"}}/>*/}
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
                        {contact.phone2?<span><i className="fa fa-phone" style={{visibility:"hidden"}}></i> {contact.phone2}<br/></span>:null}
                    </div>

                :null}

                <IpsoTabso tabs={[
                    {
                        tab:<span id="discussion-tab"><span style={{color:"white"}}>Updates</span></span>,
                        content:<div style={{padding:"15px",maxHeight:"600px",overflowY:"auto"}}>
                            <Inbox for={facility} truncate={true}/>
                        </div>
                    },
                    {
                        tab:<span id="documents-tab"><span style={{color:"white"}}>Documents</span></span>,
                        content:<div>
                            <AutoForm item={facility} schema={Facilities.schema()} form={["documents"]}/>
                        </div>
                    }
                ]} />                
            </div>
        )}
})
